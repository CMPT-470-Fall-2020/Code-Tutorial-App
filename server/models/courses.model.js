  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: { type: String, required: true },
  term: { type: String, required: true }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;