const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const serveIndex = require('serve-index');
const path = require('path');
const dotenv = require('dotenv');
const CronJob = require('node-cron');
const connectDB = require('./config/db');
const file_system = require('fs-extra');
const helmet = require('helmet');
const runCypress = require('./utils/cypressSetup');
const saveTestResult = require('./utils/saveTestResult');
const reportGenerator = require('./utils/mochawesomeSetup');
const alertManager = require('./utils/alertManagerSetup');
const monitorReportStatus = require('./utils/testResultFormatter');
const rateLimit = require('express-rate-limit');
const console = require('console');

//Load TestResult Model
const TestResults = require('./models/TestResults');

//Load Config
dotenv.config({ path: './config/config.env' });

// ENV Vars
const { NODE_ENV, PORT, CRON_SYNTAX, CYPRESS_RECORD_KEY } = process.env;

//Validate Cron Syntax
const validCronSyntax = CronJob.validate(CRON_SYNTAX);

// Rate Limit Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//Initialise express app
const app = express();
app.use(helmet());
app.use(apiLimiter);

//Connect to DB
(async () => {
  await connectDB();
})();

//DEV Logs
app.use(morgan('combined'));

let CURRENT_SUMMARY = { runs: [] };

// @route   "/"
// @desc    get the current latest test result
app.get('/', (req, res) => {
  res.setHeader('content-type', 'application/json');
  const baseUrl = req.protocol + '://' + req.get('Host');
  const result = monitorReportStatus(CURRENT_SUMMARY, baseUrl);
  res.send(JSON.stringify(result, null, 4));
});

// @route   "/testresults"
// @desc    get all previous test results
app.get('/testresults', (req, res) => {
  TestResults.find()
    .sort({ date: -1 })
    .then((results) => res.json(results))
    .catch((err) =>
      res.status(500).json({ error: 'Something went wrong', errObj: err })
    );
});

// @route   "/latest"
// @desc    get the last completed test run
app.get('/latest', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.send(JSON.stringify(CURRENT_SUMMARY, null, 4));
});

// @route   "/status"
// @desc    serve the folder for HTML report
app.use('/status', serveIndex(__dirname + '/mochawesome-report'));
app.use('/status', express.static(__dirname + '/mochawesome-report'));

// @route   "/api/uptime"
// @returns Object containing server and DB uptime or downtime status
// @desc    healthcheck for current node and DB server
const serverDBStatus = () => {
  return {
    state: 'up',
    dbState: mongoose.STATES[mongoose.connection.readyState],
  };
};
app.use(
  '/api/uptime',
  require('express-healthcheck')({
    healthy: serverDBStatus,
  })
);

/**
 * This function is at the center of this .
 * - It starts by doing a cleanup for result related data
 * - Next, use cypress's module API to run all the tests and create the results object
 * - Next, store the test result object, so that we always have the lastest data without any DB call
 * - Next, pass the test result object to be transformed and sent over to the messaging channels(slack)
 * - Finally, save the transformed test result object in DB
 */
async function runTestSuites() {
  try {
    await file_system
      .remove(__dirname + '/cypress/results')
      .then(() => runCypress())
      .then((summary) => (CURRENT_SUMMARY = summary))
      .then(() => reportGenerator(__dirname + '/cypress/results/*.json'))
      .then(() => alertManager(CURRENT_SUMMARY))
      .then(() => saveTestResult(CURRENT_SUMMARY));
  } catch (error) {
    console.error('Something went wrong', error);
  }
}

//Cron Job Scheduler
try {
  if (validCronSyntax) {
    const scheduledJobFunction = CronJob.schedule(CRON_SYNTAX, () => {
      runTestSuites();
    });
    scheduledJobFunction.start();
  }
} catch (error) {}

app.listen(PORT, () => {
  console.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
