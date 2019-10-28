const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const authenticate = require('../../authenticate');

router.post('/:userID', authenticate.verifyUser, (req, res) => {
  const filePath = path.normalize(`${__dirname}/../../tmp/downloads/file_${req.params.userID}.txt`);
  // let file = fs.createWriteStream(filePath);
  // file.on('error', function(err) { console.log('Error in write ', err) });
  // file.write(req.body.header.join(',') + '\n');
  // req.body.body.forEach(function(v) { file.write(v.join(',') + '\n'); });
  // file.end();
  console.log('filepath ', filePath);
  res.download(filePath, 'csv.file.txt');
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'application/json');
  // res.json(file);
});

module.exports = router;