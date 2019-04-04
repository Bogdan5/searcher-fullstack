const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  header: {
    type: Array,
    default: []
  },
  body: {
    type: Array,
    default: []
  },
  author: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  time: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('File', File);
