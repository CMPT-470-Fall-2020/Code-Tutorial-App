  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true, trim: true },
  accountType: { type: CharacterData, required: true },
  courses: { type: Array, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;