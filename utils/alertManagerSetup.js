const axios = require('axios');
const monitorReportStatus = require('./testResultFormatter');

module.exports = async function alertManagerSetup(results) {
  const summary = monitorReportStatus(results);
  const WEBHOOK_URL = `${process.env.SLACK_BASE_URL}/${process.env.SLACK_CLIENT}/${process.env.SLACK_TOKEN}`;
  await axios
    .post(WEBHOOK_URL, {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Synthetic Monitor test results',
            emoji: true,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*login v1 | should display account id is required*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*_PASSED_*',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*login v1 | should display invalid account id*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*_FAILED_*',
          },
        },
        {
          type: 'divider',
        },
      ],
    })
    .catch((error) => console.log(error));

  return summary;
};
