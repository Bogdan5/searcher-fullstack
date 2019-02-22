const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('custom-env').env();

const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
// const fileUpload = require('express-fileupload');
const multer = require('multer');
const csv = require('fast-csv');

const Router = express.Router;
const upload = multer({ dest: 'tmp/csv/' });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;

router.post('/', upload.single('file'), function (req, res) {
});

app.use('/upload-csv', router);

function startServer() {
  server.listen(port, function () {
    console.log('Express server listening on ', port);
  });
}

setImmediate(startServer);




// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(multer({ dest: './uploads' }).any());
// app.use(fileUpload());
app.use(bodyParser.json());
// DB Config
const db = process.env.MONGODB_URI;
console.log(db);
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);
// Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port

// if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
