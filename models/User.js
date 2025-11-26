const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String }, // URL to avatar image
  
  // Founder Path
  role: { 
    type: String, 
    enum: ['Hustler', 'Hacker', 'Hipster', 'Visionary', 'Student'], 
    default: 'Student' 
  },
  bio: { type: String },
  skills: [String], // e.g., ["React", "Marketing", "Pitching"]
  interests: [String], // e.g., ["Fintech", "Edtech"]

  // Game Mechanics (Japanese Discipline)
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  
  // Growth
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
