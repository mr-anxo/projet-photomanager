const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);