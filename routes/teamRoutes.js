const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');
const User = require('../models/User');

// @route   POST api/teams
// @desc    Create a new startup team
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, projectLink, goals } = req.body;
    
    const newTeam = new Team({
      name,
      description,
      projectLink,
      goals,
      members: [{ user: req.user.id, role: 'Leader' }]
    });

    const team = await newTeam.save();

    // Add team to user profile
    await User.findByIdAndUpdate(req.user.id, { $push: { teams: team._id } });

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/teams/:id/join
// @desc    Join an existing team
router.put('/:id/join', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if(!team) return res.status(404).json({ msg: 'Team not found' });

    // Check if already a member
    if(team.members.some(member => member.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Already a member' });
    }

    team.members.push({ user: req.user.id, role: 'Member' });
    await team.save();

    await User.findByIdAndUpdate(req.user.id, { $push: { teams: team._id } });

    res.json(team);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;