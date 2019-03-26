const mongoose = require('mongoose');

const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

// Create Schema
const User = new Schema({
  email: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
