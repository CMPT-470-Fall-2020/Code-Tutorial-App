  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  postTitle: {type: String, required: true },
  postText: { type: String, required: true }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;