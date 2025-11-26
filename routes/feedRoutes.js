const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FeedItem = require('../models/FeedItem');

// @route   GET api/feed
// @desc    Get curated feed (Mix of system content and user achievements)
router.get('/', auth, async (req, res) => {
  try {
    // Fetch system curated news AND achievements from others
    const feed = await FeedItem.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar role')
      .limit(50);

    res.json(feed);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/feed
// @desc    Admin or System posts content (For AI Curated Feed simulation)
router.post('/', async (req, res) => {
    // Ideally protected by Admin middleware
    const { type, title, content, url, tags } = req.body;
    try {
        const newFeedItem = new FeedItem({
            type,
            title,
            content,
            url,
            tags,
            isCurated: true
        });
        await newFeedItem.save();
        res.json(newFeedItem);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
