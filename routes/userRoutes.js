const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/me
// @desc    Get current user profile (Profile, Stats, Teams)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude password
      .populate('teams', 'name role')
      .populate('joinedEvents', 'title date');
      
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update profile details (Bio, Role, Skills)
router.put('/profile', auth, async (req, res) => {
  const { bio, role, skills, interests, avatar } = req.body;
  const profileFields = {};
  
  if (bio) profileFields.bio = bio;
  if (role) profileFields.role = role;
  if (skills) profileFields.skills = skills;
  if (interests) profileFields.interests = interests;
  if (avatar) profileFields.avatar = avatar;

  try {
    let user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: profileFields }, 
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;