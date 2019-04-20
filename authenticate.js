const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const config = require('./config/config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 7200 });
}

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log('JWT Payload: ', jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        console.log('authenticate error');
        return done(err, false);
      }
      if (user) {
        console.log('authenticate user: ', user);
        return done(null, user);
      }
      console.log('authenticate point');
      return done(null, false);
    });
  }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

// exports.verifyAdmin = (req, res, next) => {
//   console.log('verifyAdmin', req);
//   if (req.user.admin) {
//     next();
//   } else {
//     const err = new Error('Not allowed!');
//     err.status = 403;
//     return next(err);
//   }
// };