  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
    trim: true // trims whitespace off the end
  },
  accountType: { type: CharacterData, required: true },
  courses: { type: Array, required: true },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;