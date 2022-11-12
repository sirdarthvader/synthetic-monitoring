const cypress = require('cypress');
const { NODE_ENV, CYPRESS_RECORD_KEY } = process.env;

/**
 * @returns {Promise} a Promise that resolves with an object containing the tests results.
 */
module.exports = function runCypress() {
  const DEV = NODE_ENV === 'development';

  let cypressRunOptions = {
    config: {
      video: true,
    },
    record: DEV ? false : true,
    key: DEV ? null : CYPRESS_RECORD_KEY,
  };
  /**
   * Even when tests fail, the Promise resolves with the test results.
   * The Promise is only rejected if Cypress cannot run for some reason.
   * (for example if a binary has not been installed or it cannot find a module dependency).
   */
  return cypress
    .run({ ...cypressRunOptions })
    .then((result) => {
      if (result.failures) {
        console.error('Could not execute tests');
        testResults = null;
        console.error(result.message);
        process.exit(result.failures);
      } else {
        testResults = result;
      }
      return testResults;
    })
    .catch((err) => {
      console.error(err.message);
      process.exitCode = 1;
    });
};
