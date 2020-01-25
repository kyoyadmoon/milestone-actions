// Requires and variable definition
const log = require('loglevel')
const fs = require('fs')
const moment = require('moment');
const axios = require('axios');
const { exec } = require('child_process');

// Uncomment this if you want to check if your local env variables are being set
// console.dir(process.env)

// Method that loads the workflow event JSON payload
// let getEventData = function () {
//   return JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
// }

// Set default log level or read the environment setting
log.setLevel(process.env.LOG_LEVEL || 'info')

// Print out the event data
// log.trace(`Event data: ${JSON.stringify(getEventData())}`)

const {
  MILESTONE_TITLE,
  MILESTONE_DESCRIPTION,
  MILESTONE_DUE_ON,
  GITHUB_TOKEN,
  GITHUB_REPOSITORY
} = process.env;

/** log env */
log.info('GITHUB REPOSITORY', GITHUB_REPOSITORY);
log.info('TITLE', MILESTONE_TITLE);
log.info('DESCRIPTION', MILESTONE_DESCRIPTION);
log.info('DUE_ON', MILESTONE_DUE_ON);

async function createMilestone() {
  try {
    const response = await axios({
      url: `https://api.github.com/repos/${GITHUB_REPOSITORY}/milestones`,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      validateStatus: function (status) {
        return status >= 201 && status < 300; // default
      },
      data: {
        title: MILESTONE_TITLE,
        description: MILESTONE_DESCRIPTION || '',
        state: "open",
        ...(
          MILESTONE_DUE_ON
            ? { due_on: moment(parseInt(MILESTONE_DUE_ON, 10) * 1000).toISOString() }
            : {}
        )
      }
    });

    const responseData = response.data;
    const { html_url, number } = responseData;

    // log.info('response', responseData);
    log.info('html_url', html_url);
    log.info('number', number);

    const setOutputsCmd = `
      echo ::set-output name=html_url::${html_url}
      echo ::set-output name=number::${number}
    `;

    exec(setOutputsCmd, (err, stdout, stderr) => {
      console.log(`${stdout}`);
      console.log(`${stderr}`);
      if (err !== null) {
        throw err;
      }
    });

  } catch (error) {
    log.error(error);
    throw error;
  }
}

createMilestone();