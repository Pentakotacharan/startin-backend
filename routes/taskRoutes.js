const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// @route   POST api/tasks
// @desc    Create a new task/goal
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, difficulty } = req.body;
    
    // Calculate XP based on difficulty
    let xpReward = 10;
    if(difficulty === 'Medium') xpReward = 20;
    if(difficulty === 'Hard') xpReward = 50;

    const newTask = new Task({
      user: req.user.id,
      title,
      type,
      difficulty,
      xpReward
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id/complete
// @desc    Complete a task (Updates XP & Streaks)
router.put('/:id/complete', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check user ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (task.isCompleted) return res.status(400).json({ msg: 'Already completed' });

    // Mark complete
    task.isCompleted = true;
    await task.save();

    // Update User XP and Streak Logic
    const user = await User.findById(req.user.id);
    user.xp += task.xpReward;
    
    // Simple Level up logic
    if (user.xp > user.level * 100) {
      user.level += 1;
    }

    // Streak Logic: Check if last active was yesterday
    const today = new Date();
    const lastActive = new Date(user.lastActiveDate);
    
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays <= 1) {
       // Maintained streak (logic simplified for example)
       // Ideally, check if calendar day is consecutive
       user.currentStreak += 1;
       if(user.currentStreak > user.longestStreak) user.longestStreak = user.currentStreak;
    } else {
       // Streak broken
       user.currentStreak = 1;
    }
    
    user.lastActiveDate = Date.now();
    await user.save();

    res.json({ task, userXP: user.xp, level: user.level, streak: user.currentStreak });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
