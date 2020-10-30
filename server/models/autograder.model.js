  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const autograderSchema = new Schema({
  testID: { type: BigInt, required: true, unique: true },
  userID: { type: string, required: true },
  courseID: { type: BigInt, required: true },
  code: { type: string, required: true },
  testName: { type: string, required: true },
}, {
  timestamps: true,
});

const Autograder = mongoose.model('Autograder', autograderSchema);

module.exports = Autograder;