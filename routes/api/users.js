// // const express = require('express');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // require('custom-env').env();

// // const router = express.Router();

// // // Load input validation
// // const validateRegisterInput = require('../../validation/register');
// // const validateLoginInput = require('../../validation/login');

// // // Load User model
// // const User = require('../../models/User');

// // // @route POST api/users/register
// // // @desc Register user
// // // @access Public
// // router.post('/register', (req, res) => {
// //   // Form validation
// //   const { errors, isValid } = validateRegisterInput(req.body);
// //   // Check validation
// //   if (!isValid) {
// //     return res.status(400).json(errors);
// //   }
// //   User.findOne({ email: req.body.email }).then((user) => {
// //     if (user) {
// //       return res.status(400).json({ email: 'Email already exists' });
// //     }
//     // const newUser = new User({
//     //   nameUser: req.body.nameUser,
//     //   email: req.body.email,
//     //   password: req.body.password,
//     // });

// //     // Hash password before saving in database
// //     bcrypt.genSalt(10, (err, salt) => {
// //       bcrypt.hash(newUser.password, salt, (error, hash) => {
// //         if (err) throw err;
// //         newUser.password = hash;
// //         newUser
// //           .save()
// //           .then(user1 => res.json(user1))
// //           .catch(err1 => console.log(err1));
// //       });
// //     });
// //   });
// // });

// // // @route POST api/users/signin
// // // @desc Login user and return JWT token
// // // @access Public
// // router.post('/signin', (req, res) => {
// //   // Form validation
// //   const { errors, isValid } = validateLoginInput(req.body);
// //   // Check validation
// //   if (!isValid) {
// //     return res.status(400).json(errors);
// //   }
// //   const { email, password } = req.body;
// //   // Find user by email
// //   User.findOne({ email }).then((user) => {
// //     // Check if user exists
// //     if (!user) {
// //       return res.status(404).json({ emailnotfound: 'Email not found' });
// //     }
// //     // Check password
// //     bcrypt.compare(password, user.password).then((isMatch) => {
// //       if (isMatch) {
// //         // User matched
// //         // Create JWT Payload
// //         const payload = {
// //           id: user.id,
// //           nameUser: user.nameUser,
// //         };
// //         // Sign token
// //         jwt.sign(
// //           payload,
// //           process.env.secretOrKey,
// //           {
// //             expiresIn: 31556926, // 1 year in seconds
// //           },
// //           (err, token) => {
// //             res.json({
// //               success: true,
// //               token: `Bearer  + ${token}`,
// //             });
// //           },
// //         );
// //       } else {
// //         return res
// //           .status(400)
// //           .json({ passwordincorrect: 'Password incorrect' });
// //       }
// //     });
// //   });
// // });

// // module.exports = router;

// const express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// // const keys = require('../keys');
// const User = require('../../models/User');
// require('custom-env').env();

// const router = express.Router();

// router.post('/register', async (req, res) => {
//   const { nameUser, email, password } = req.body;

//   // authentication will take approximately 13 seconds
//   // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
//   const hashCost = 10;

//   try {
//     const passwordHash = await bcrypt.hash(password, hashCost);
//     const userDocument = new User({ nameUser, email, passwordHash });
//     await userDocument.save();
    
//     res.status(200).send({ email });
    
//   } catch (error) {
//     res.status(400).send({
//       error: 'req body should take the form { email, password }',
//     });
//   }
// });

// router.post('/login', (req, res) => {
//   passport.authenticate(
//     'local',
//     { session: false },
//     (error, user) => {

//       if (error || !user) {
//         res.status(400).json({ error });
//       }

//       /** This is what ends up in our JWT */
//       const payload = {
//         username: user.username,
//         expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
//       };

//       /** assigns payload to req.user */
//       req.login(payload, {session: false}, (error) => {
//         if (error) {
//           res.status(400).send({ error });
//         }

//         /** generate a signed json web token and return it in the response */
//         const token = jwt.sign(JSON.stringify(payload), process.env.sercretOrKey);

//         /** assign our jwt to the cookie */
//         res.cookie('jwt', jwt, { httpOnly: true, secure: true });
//         res.status(200).send({ username });
//       });
//     },
//   )(req, res);
// });

// module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../../models/User');
const authenticate = require('../../authenticate');
// const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, err => next(err))
    .catch(err => next(err));
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password,
    (err, user) => {
      if (err) {
        console.log('err1: ', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err });
      } else {
        if (req.body.firstname) { user.firstname = req.body.firstname; }
        if (req.body.lastname) { user.lastname = req.body.lastname; }
        user.save((err, user) => {
          if (err) {
            console.log('err2');
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err });
            return;
          }

          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration successful!' });
          });
        });
      }
    });
});

router.post('/signin', passport.authenticate('local'), (req, res) => {
  console.log("authenticator");
  const token = authenticate.getToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token,
    status: 'You are successfully logged in!',
  });
});

router.get('/logout', (req, res, next) => {
  console.log(req.session);
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;