const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  header: {
    type: Array,
    default: []
  },
  data: {
    type: Array,
    default: []
  },
  author: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('File', File);
