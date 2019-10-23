const express = require('express');
const router = express.Router();
const fs = require('fs');

const authenticate = require('../../authenticate');

router.post('/', authenticate.verifyUser, (req, res) => {
  console.log('download file begin', req.body);
  fs.writeFile(`file_${req.params.fileID}.txt`, req.body, (err) => {
    console.log(err);
  });
});

module.exports = router;