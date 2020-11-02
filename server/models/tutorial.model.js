  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tutorialSchema = new Schema({
  tutorialName: { type: String, required: true },
  userID: { type: mongoose.Types.ObjectId, required: true },
  courseID: { type: mongoose.Types.ObjectId, required: true },
  codeText: { type: String, required: true }
}, {
  timestamps: true
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;