# synthetic-monitors

> Synthetic monitoring is a monitoring technique that is done by using an emulation or scripted recordings of transactions
> [Wikipedia article](https://en.wikipedia.org/wiki/Synthetic_monitoring)

Run with `npm start` which starts a service on port 8080. You can play with the Cypress tests directly via `npm run cy:open`

## What does this do?

It runs a Cypress test suite, waits for 5 minutes then runs it again and records the results to http://localhost:8080

If you visit that URL it will give you links to other options such as:

- Videos of each test run
- An easy to read status page (generated with [Mochawesome](https://www.npmjs.com/package/mochawesome))
- A JSON API endpoint for querying the existing state

## Environment Variables

You can configure how the server runs:

- `WAITING_TIME_INTERVAL`: How long to wait in minutes between a test run finishing before starting a new run (default: 5 minutes)
- `SPECS_REGEX`: Select which specs to run (default all: "/cypress/integration/\*-spec.js")
