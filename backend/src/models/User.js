const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  points: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  lastQuizDate: {
    type: Date,
  },
  bio: { type: String, default: 'Passionate MPSC Aspirant' },
  location: { type: String, default: 'Maharashtra, India' },
  phone: { type: String },
  github: { type: String },
  linkedin: { type: String },
  longestStreak: { type: Number, default: 0 },
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
