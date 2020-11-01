  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userID: { type: String, required: true },
  commentText: { type: String, required: true }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;