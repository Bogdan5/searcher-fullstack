const express = require('express');
const fs = require('fs');
// const csv = require('fast-csv');
// const multer = require('multer');

const router = express.Router();
// const passport = require('passport');
// const upload = multer({ dest: 'tmp/csv/' });

const upload = require("express-fileupload");
const csvtojson = require("csvtojson");
let csvData = 'test';

// Load User model
const User = require('../../models/User');

// @route POST api/upload-csv
// @desc Upload file
// @access Public
router.post('/', passport.authenticate('jwt', { session: false }),
  upload.single('myFile'), function (req, res) {
  console.log('start post');
  const fileRows = [];

  // open uploaded file
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      // if (fileRows.length === 1) {
      //   const header = fileRows[0];
      //   const headerArray = header.split(',');
      //   const trimmed = headerArray.map(el => el.trim());
      // }
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows)
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
    })
});

router.post("/", (req, res) => {
  /** convert req buffer into csv string , 
  *   "csvfile" is the name of my file given at name attribute in input tag */
    csvData = req.files.myFile.data.toString('utf8');
    return csvtojson().fromString(csvData).then(json => 
      { 
        console.log('csvData', csvData);
        return res.status(201).json({csv:csvData, json:json})
      }
    );
});

module.exports = router;
