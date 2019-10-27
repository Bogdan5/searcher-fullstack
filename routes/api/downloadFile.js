const express = require('express');
const router = express.Router();
const fs = require('fs');

const authenticate = require('../../authenticate');

router.post('/:userID', authenticate.verifyUser, (req, res) => {
  console.log('download file begin', req.body);

  let file = fs.createWriteStream(`/tmp/downloads/file_${req.params.fileID}.txt`);
  file.on('error', function(err) { /* error handling */ });
  req.body.forEach(function(v) { file.write(v.join(', ') + '\n'); });
  file.end();

});

module.exports = router;