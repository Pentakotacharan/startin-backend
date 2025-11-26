const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/match
// @desc    Find potential co-founders based on complementary roles
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const myRole = currentUser.role;
    
    let targetRoles = [];
    
    // Basic Matching Logic (Opposites attract)
    if (myRole === 'Hacker') targetRoles = ['Hustler', 'Visionary'];
    else if (myRole === 'Hustler') targetRoles = ['Hacker', 'Hipster'];
    else if (myRole === 'Hipster') targetRoles = ['Hacker', 'Hustler'];
    else targetRoles = ['Hacker', 'Hustler', 'Hipster', 'Visionary']; // Generic

    // Find users with target roles, excluding self
    const matches = await User.find({
      role: { $in: targetRoles },
      _id: { $ne: req.user.id }
    }).select('-password').limit(20);

    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;