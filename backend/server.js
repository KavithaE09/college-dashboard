// CRITICAL — Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://dashboard-training.netlify.app"
  ],
  credentials: true
}));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'College Dashboard API is running!' });
});

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

console.log("✅ Routes registered: /api/auth and /api/students");

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);