const express = require('express');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();
const passport = require('passport');
const authenticate = require('../../authenticate');
const upload = multer({ dest: 'tmp/csv/' });
const config = require('../../config/config');

// const upload = require("express-fileupload");
const csvtojson = require("csvtojson");
let csvData = 'test';

// Load User model
const User = require('../../models/User');
const File = require('../../models/File');

// @route POST api/upload-csv
// @desc Upload file
// @access Public
// 
router.post('/', authenticate.verifyUser, upload.single('file'),
  function (req, res) {
    // console.log('res is: ', res);
    const fileRows = [];
    // const decoded = jwt.verify(res.data.token, config.secretKey);

    // open uploaded file
    csv.fromPath(req.file.path)
      .on("data", function (data) {
        if (data.length) {
          fileRows.push(data); // push each row
        }
      })
      .on("end", function () {
        let header = [];
        fs.unlinkSync(req.file.path);   // remove temp file
        //process "fileRows" and respond
        if (req.body.firstRowHeader) {
          header = fileRows.shift();
        } else {
          let maxLength = fileRows.reduce((acc, el) => Math.max(acc, el.length), 0);
          if (maxLength > 10) { maxLength = 10}
          for (let i = 0; i < maxLength; i++) {
            header.push(`Column ${i + 1}`);
          }
        }
        File.create({
          header,
          body: fileRows,
          description: req.body.description,
          author: mongoose.Types.ObjectId(req.user._id)
        }, (err, file) => {
          if (err) {
            return res.sendStatus(404).end('Error' + err);
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(file);
          }
        });
      })
      .on('error', (err) => res.sendStatus(404).end('Error in file upload: ', err));
});



module.exports = router;
