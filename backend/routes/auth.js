const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role: role || 'student'
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

// Login Route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login error', error: err.message });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  })(req, res, next);
});

// Logout Route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error', error: err.message });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get Current User Route
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// IMPORTANT: Export the router correctly
module.exports = router;