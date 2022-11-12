const express = require('express');
const mongoose = require('mongoose');
const monitorReportStatus = require('./testResultFormatter');

// Load TestResult Model
const TestResult = require('../models/TestResults');

module.exports = async function saveTestResult(results) {
  let latestSavedResult;
  const summary = monitorReportStatus(results);
  const { lastRun } = summary;
  const { duration } = lastRun;

  const newTestResult = new TestResult({
    totalSuites: Number(lastRun.totalSuites),
    totalTests: Number(lastRun.totalTests),
    totalFailed: Number(lastRun.totalFailed),
    totalPassed: Number(lastRun.totalPassed),
    totalPending: Number(lastRun.totalPending),
    totalSkipped: Number(lastRun.totalSkipped),
    duration: duration,
    tests: lastRun.tests,
  });

  //save to DB
  await newTestResult
    .save()
    .then((data) => (latestSavedResult = data))
    .catch((err) => {
      console.info('Unable to save data to DB....');
      console.table(err);
    });

  return latestSavedResult;
};
