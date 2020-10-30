  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tutorialSchema = new Schema({
  tutorialName: { type: string, required: true },
  userID: { type: string, required: true },
  courseID: { type: BigInt, required: true },
  codeText: { type: string, required: true }
}, {
  timestamps: true,
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;