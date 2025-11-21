const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Helper → Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: "7d" }
  );
};

// --------------------------------------------
// REGISTER
// --------------------------------------------
router.post("/register", async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email);
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? "Email already registered" 
          : "Username already taken",
      });
    }

    // Create new user (password will be hashed by pre-save hook in User model)
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password, // ← Will be hashed automatically by User model
      role: role || "student",
    });

    await newUser.save();
    console.log('✅ User registered successfully:', newUser.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error registering user. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// --------------------------------------------
// LOGIN (JWT) - FIXED TO USE BCRYPT
// --------------------------------------------
router.post("/login", async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Use bcrypt to compare password (comparePassword method from User model)
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user);
    console.log('✅ Login successful:', user.email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// --------------------------------------------
// LOGOUT
// --------------------------------------------
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// --------------------------------------------
// CHECK USER (JWT Protected)
// --------------------------------------------
router.get("/check", auth, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

module.exports = router;