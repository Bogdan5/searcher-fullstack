const express = require('express');
const router = express.Router();
const authenticate = require('../../authenticate');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const User = require('../../models/User');

router.get('/test', authenticate.verifyUser, (req, res, next) => {
  console.log('authenticated');
  const token = req.headers.authorization.split(' ')[1];
  const tokenPayload =  jwt.verify(token, config.secretKey);
  User.findOne({ _id: tokenPayload._id }, (err, user) => {
    if (err) {
      console.log('authenticate error');
      res.statusCode = 500;
      // res.redirect('/api/user/signin');
      res.json({authenticated: false});
    } else if (user) {
      res.statusCode = 200;
      // res.redirect('/api/user/signin');
      res.json({authenticated: true, _id: tokenPayload._id, username: user.username});
    } else {
      res.statusCode = 401;
      // res.redirect('/api/user/signin');
      res.json({authenticated: false});
    }
  });
});

module.exports = router;