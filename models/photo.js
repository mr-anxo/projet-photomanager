const mongoose = require('mongoose');
const Schema = mongoose.Schema

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imagePath: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);