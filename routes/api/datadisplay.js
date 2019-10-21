const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../../authenticate');

const File = require('../../models/File');

router.get('/:fileID', authenticate.verifyUser, (req, res, next) => {
  File.findById(req.params.fileID)
    .then((file) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(file);
    }, (err) => {
      next(err);
    })
    .catch(err => console.log('Error: ', err));
});

router.put('/:fileID', authenticate.verifyUser, (req, res, next) =>{
  File.findOneAndUpdate({ _id: req.params.fileID },
    { $set: {body: req.body.body, columnTypes: req.body.columnTypes} }, { upsert: true, useFindAndModify: false })
    .then((file) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(file);
    }, (err) => {
      next(err);
    })
    .catch(err => console.log('Error: ', err));;
});

module.exports = router;