const express = require('express');
const router = express.Router();

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('not authenticated')
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({authenticated: true});
  }
}

router.get('/', loggedIn, (req, res, next) => {
  console.log('authenticated');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({authenticated: false});
});

module.exports = router;