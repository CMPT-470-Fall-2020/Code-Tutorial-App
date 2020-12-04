  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const autograderSchema = new Schema({
  userID: { type: mongoose.Types.ObjectId, required: true },
  courseID: { type: mongoose.Types.ObjectId, required: true },
  language: {type: String, required: true },
  fileName: { type: String, required: true },
  testName: { type: String, required: true },
}, {
  timestamps: true
});

const Autograder = mongoose.model('Autograder', autograderSchema);

module.exports = Autograder;