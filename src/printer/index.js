'use strict';

let express = require('express');
let router = express.Router();
let execCmd = require('child_process').exec;
var fs = require('fs');
let status = {};

let chromeExe = process.env.CHROME_EXE || "/Applications/'Google\ Chrome.app'/Contents/MacOS/'Google\ Chrome'";

let exec = (cmd, options) => {
  return new Promise((resolve, reject) => {
    execCmd(cmd, options, (error, stdout, stderr) => {
      if (!error) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });
};

let printNow = (workDir, url) => {
  console.log(`Printing URL: ${url}`);
  return exec(`${chromeExe} --headless --disable-gpu --no-sandbox --print-to-pdf ${url}`, {
    cwd: workDir
  });
};

let createWorkDir = (jobId) => {
  return new Promise((resolve, reject) => {
    let path = `./job-${jobId}`;
    fs.mkdir(path, 0o777, (err) => {
      if (!err) {
        resolve(path);
      } else {
        reject(err);
      }
    });
  });
};

router.get('/status', (req, res) => {
  let id = req.query.jobId;
  res.status(200).send(status[id]);
});

router.get('/download', (req, res) => {
  let id = req.query.jobId;

  if (fs.existsSync(`${__dirname}/../job-${id}/output.pdf`)) {
    res.sendFile(`job-${id}/output.pdf`, { root : `${__dirname}/../` });
  } else {
    res.status(500).send(`Cant find file for job ${id}`);
  }

});

router.get('/', (req, res) => {
  let url = req.query.url;

  if (url) {
    let jobId = new Date().getTime();
    status[jobId] = 'waiting';

    createWorkDir(jobId).then((workDir) => {
      status[jobId] = {
        status: 'printing ...'
      };
      isBusy = true;
      return printNow(workDir, url);
    }).then(() => {
      isBusy = false;
      status[jobId] = { status: 'ready', download: `http://${req.headers.host}/print/download?jobId=${jobId}` };
      console.log(`${jobId} is ready!`);
    }).catch((err) => {
      isBusy = false;
      console.log(`Error for ${jobId}!`);
      console.log(err);
      status[jobId] = { status: 'error', message: err };
    });

    res.status(200).send({
      jobId: jobId,
      status: `http://${req.headers.host}/print/status?jobId=${jobId}`
    });

  } else {
    res.status(500).send({ error: 'URL was not added as query parameter!' });
  }

});

module.exports = { router };
