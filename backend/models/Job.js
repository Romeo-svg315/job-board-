const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-Time', 'Part-Time', 'Remote', 'Internship', 'Contract'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
    },
    description: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
    },
    contactPhone: {
      type: String,
    },
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  salary: {
    type: String,
    default: 'Negotiable',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
