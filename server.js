const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('custom-env').env();
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');

const users = require('./routes/api/users');
const uploadCSV = require('./routes/api/upload-csv');
// const fileUpload = require('express-fileupload');


const Router = express.Router;

const app = express();

const router = new Router();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// connect database
// const db = process.env.MONGODB_URI;
const db = "mongodb://localhost:27017/MyDb";
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
// require('./config/passport')(passport);

app.get('/', (req, res) => res.send('Hello World'));

// Use routes
app.use('/api/users', users);
app.use('/api/upload-csv', uploadCSV);

// Start server
function startServer() {
  server.listen(port, function () {
    console.log('Express server listening on ', port);
  });
}

setImmediate(startServer);




// // Bodyparser middleware
// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   }),
// );
// app.use(multer({ dest: './uploads' }).any());
// // app.use(fileUpload());
// app.use(bodyParser.json());
// // DB Config
// const db = process.env.MONGODB_URI;
// console.log(db);
// // Connect to MongoDB
// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true },
//   )
//   .then(() => console.log('MongoDB successfully connected'))
//   .catch(err => console.log(err));

// // Passport middleware
// app.use(passport.initialize());
// // Passport config
// require('./config/passport')(passport);
// // Routes
// app.use('/api/users', users);

// const port = process.env.PORT || 5000; // process.env.port is Heroku's port

// // if you choose to deploy the app there
// app.listen(port, () => console.log(`Server up and running on port ${port} !`));
