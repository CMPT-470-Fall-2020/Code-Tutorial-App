  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentID: {type: BigInt, required: true, unique: true },
  postID: { type: BigInt, required: true },
  userID: { type: string, required: true },
  commentText: { type: string, required: true }
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;