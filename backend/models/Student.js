const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  mark: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for faster queries
studentSchema.index({ userId: 1, subject: 1 });

module.exports = mongoose.model('Student', studentSchema);