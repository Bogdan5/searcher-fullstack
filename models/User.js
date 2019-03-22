const mongoose = require('mongoose');

const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

//Create fileSchema
// const fileSchema = new Schema({
//   head: {
//     type: [String],
//   },
//   data: {
//     any: [[]],
//   }
// })

// Create Schema
const User = new Schema({
  // email: {
  //   type: String,
  //   required: true,
  // },
  // date: {
  //   type: Date,
  //   default: Date.now,
  // },
  // anonymous: {
  //   type: Boolean,
  //   default: true,
  // },
  // files: [fileSchema]
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
