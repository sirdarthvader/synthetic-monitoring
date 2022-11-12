# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.2.0] - 01-10-2022

### Added

- The ability to schedule cron jobs as per the cron syntax
- Setup new mongoDB collection to store all the test results from cypress runs
- Mongoose, to be used as a Object Data Modelling library for MongoDB and NodeJS
- New setup to bring in environment files during the runtime
- New GET route {/api/uptime} endpoint to check on server and DB connection health status
- New GET route {/testresults} to fetch all the test results till date from database

### Changed

- Cypress test runnner setup was modified to catch any unexpected errors while running
- Slack integration setup was updated to wait for the respone from DB, before sending notification
- Abstracted testResultFormatter to be re-used across different modules

## [v1.0.0] - 06-09-2022

### Added

- Several packages under dev and prod dependency
- First e2e test file for login link
- Cypress env and config files
- mochawesome merge and report generator to extract the reports
- mochawesome folder to add the markup and style for test report page
- Slack integration for sending test run summary

### Changed

- Start using "changelog" over "change log" since it's the common usage.
