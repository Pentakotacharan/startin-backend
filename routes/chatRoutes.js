const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @route   POST api/chat
// @desc    Start or get conversation with a specific user
router.post('/', auth, async (req, res) => {
  const { recipientId } = req.body;
  
  try {
    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, recipientId]
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chat/:conversationId
// @desc    Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ 
      conversationId: req.params.conversationId 
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chat/message
// @desc    Send a message
router.post('/message', auth, async (req, res) => {
  const { conversationId, text } = req.body;
  try {
    const newMessage = new Message({
      conversationId,
      sender: req.user.id,
      text
    });
    await newMessage.save();

    // Update last message in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageDate: Date.now()
    });

    res.json(newMessage);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;