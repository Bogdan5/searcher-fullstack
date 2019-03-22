const mongoose = require('mongoose');

const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

//Create fileSchema
const fileSchema = new Schema({
  header: {
    type: [String],
  },
  data: {
    any: [[]],
  }
})

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  anonymous: {
    type: Boolean,
    default: true,
  },
  files: [fileSchema]
});

UserSchema.plugin(passport.LocalMongoose);
const User = mongoose.model('users', UserSchema);
module.exports = User;
