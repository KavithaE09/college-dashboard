const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Local Strategy for email/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Use email as username
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Success
        return done(null, user);
      } catch (error) {
        console.error('Error in Local Strategy:', error);
        return done(error);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;