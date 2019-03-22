// const JwtStrategy = require('passport-jwt').Strategy;
// const { ExtractJwt } = require('passport-jwt');
// const mongoose = require('mongoose');

// const User = mongoose.model('users');
// require('custom-env').env();

// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.secretOrKey;
// module.exports = (passport) => {
//   passport.use(
//     new JwtStrategy(opts, (jwt_payload, done) => {
//       console.log('start passport: ', jwt_payload);
//       User.findById(jwt_payload.id)
//         .then((user) => {
//           if (user) {
//             return done(null, user);
//           }
//           return done(null, false);
//         })
//         .catch(err => console.log(err));
//     }),
//   );
// };

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('custom-env').env();

// const { secret } = require('./keys');

const User = mongoose.model('users');

passport.use(new LocalStrategy({
  emailField: email,
  passwordField: password,
}, async (email, password, done) => {
  try {
    const userDocument = await UserModel.findOne({email: email}).exec();
    const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordsMatch) {
      return done(null, userDocument);
    } else {
      return done('Incorrect Username / Password');
    }
  } catch (error) {
    done(error);
  }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: process.env.secretOrKey,
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    }

    return done(null, jwtPayload);
  }
));