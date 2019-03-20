const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  nameUser: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
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
const User = mongoose.model('users', UserSchema);
module.exports = User;
