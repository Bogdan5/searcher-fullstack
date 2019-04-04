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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('File', File);
