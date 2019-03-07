const express = require('express');
const fs = require('fs');
const csv = require('fast-csv');

const router = express.Router();

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

module.exports = router;
