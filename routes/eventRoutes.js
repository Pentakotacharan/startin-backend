const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

// @route   GET api/events
// @desc    Get all upcoming events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create an event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body;
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      type,
      organizer: req.user.id
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/:id/attend
// @desc    RSVP to an event
router.put('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already attending' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    await User.findByIdAndUpdate(req.user.id, { $push: { joinedEvents: event._id } });

    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;