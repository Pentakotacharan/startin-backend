const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Member' } // e.g., Leader, Developer, Marketing
  }],
  goals: [{ type: String }], // Simple array of team goals
  projectLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', TeamSchema);