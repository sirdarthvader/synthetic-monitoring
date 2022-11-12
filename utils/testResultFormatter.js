module.exports = function monitorReportStatus(results, baseUrl = '') {
  const tests = [];
  let formattedResult = { runs: [] };

  //if this is not the first run
  //use the results data to do simple formating
  if (results?.runs?.length) {
    results.runs.forEach((run) => {
      const videoLink =
        baseUrl + '/videos/' + run.video?.split('/')?.slice(-1)[0];

      run.tests.length &&
        run.tests.forEach((test) => {
          const title = test.title.join(' | => ');
          const state = test.state;
          const testBody = test.body;
          tests.push({ title, state, videoLink, testBody });
        });
    });

    //Create custom test result object, this object will be saved to DB
    //Further, the same object will be used to send slack notification with run result
    formattedResult = {
      lastRun: {
        totalSuites: results.totalSuites,
        totalTests: results.totalTests,
        totalFailed: results.totalFailed,
        totalPassed: results.totalPassed,
        totalPending: results.totalPending,
        totalSkipped: results.totalSkipped,
        duration: {
          startedAt: results.startedTestsAt,
          endedAt: results.endedTestsAt,
          totalDuration: results.totalDuration,
        },
        tests,
      },
      statusPageLink: baseUrl + '/status/mochawesome.html',
    };
  }

  return formattedResult;
};
