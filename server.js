const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load Config
dotenv.config();

// Initialize App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected: Startin Database');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// --- ROUTE DEFINITIONS ---
// Authentication & User Profile
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Core Features: Tasks, Goals, Streaks
app.use('/api/tasks', require('./routes/taskRoutes'));

// Networking: Co-founder Matching & Teams
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));

// Community: Feed & Events
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Communication: Inbox/Chat
app.use('/api/chat', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));