const express = require('express');
const passport = require('passport');
const authenticate = require('../../authenticate');
const router = express.Router();

router.get('/:userID', authenticate.verifyUser, (req, res, next) =>{
  File.find({author: userID})
    .then((files) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(files);
    }, (err) => {
      next(err);
    })
    .catch(err => console.log('Error: ', err));
});

module.exports = router;