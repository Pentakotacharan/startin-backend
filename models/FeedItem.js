const mongoose = require('mongoose');

const FeedItemSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Article', 'News', 'Achievement', 'EventUpdate'], 
    required: true 
  },
  title: { type: String, required: true },
  content: { type: String }, // Text content or summary
  url: { type: String }, // Link to external article
  imageUrl: { type: String },
  
  // If it's a user achievement
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // AI Curation tags
  tags: [String],
  isCurated: { type: Boolean, default: false }, // True if system-generated
  
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeedItem', FeedItemSchema);
