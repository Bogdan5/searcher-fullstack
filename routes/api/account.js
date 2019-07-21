const express = require('express');
const passport = require('passport');
const authenticate = require('../../authenticate');
const router = express.Router();

const File = require('../../models/File');

router.get('/:userID', authenticate.verifyUser, (req, res, next) =>{
  // console.log('Response for the get account: ', res);
  File.find({author: req.params.userID}, {header: 0, body: 0})
    .then((files) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(files);
    }, (err) => {
      next(err);
    })
    .catch(err => console.log('Error: ', err));
});

router.delete('/:userID', authenticate.verifyUser, (req, res, next) => {
  console.log('headers id: ', req.headers.deletedid);
  File.findByIdAndDelete(req.headers.deletedid)
    .then((err, data) => {
      if (err) {
        res.statusCode = 404;
        console.log('Delete not successful');
        next(err);
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        console.log('delete is successful');
        res.json(data);
      }
    })
    .catch(err => next(err));
});

module.exports = router;