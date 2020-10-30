  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  postID: { type: BigInt, required: true, unique: true },
  userID: { type: string, required: true },
  courseID: { type: BigInt, required: true },
  postTitle: {type: string, required: true },
  postText: { type: string, required: true }
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;