const express = require('express');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const passport = require('passport');
const upload = multer({ dest: 'tmp/csv/' });

// const upload = require("express-fileupload");
const csvtojson = require("csvtojson");
let csvData = 'test';

// Load User model
const User = require('../../models/User');

// @route POST api/upload-csv
// @desc Upload file
// @access Public
router.post('/', passport.authenticate('jwt', {session: false}),
  upload.single('file'), function (req, res) {
  console.log('start post - req.file is: ',req.file);
  const fileRows = [];

  // open uploaded file
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      let header = [];
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      if (req.body.firstRowHeader) {
        header = fileRows.shift();
      }
      console.log('req.body is: ', req.body);
      return res.sendStatus(200).end();
    })
    .on('error', (err) => res.sendStatus(404).end('Error in file upload: ', err));
}
);



module.exports = router;
