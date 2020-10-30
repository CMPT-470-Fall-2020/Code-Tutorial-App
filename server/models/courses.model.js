  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseID: { type: BigInt, required: true, unique: true },
  courseName: { type: string, required: true },
  term: { type: string, required: true }
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;