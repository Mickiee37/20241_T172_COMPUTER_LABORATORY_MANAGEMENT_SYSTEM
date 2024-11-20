// authRoutes.js (or login.js)
const express = require('express');
const { verifyRecaptcha } = require('../Services/verifyRecaptcha'); // Import the verifyRecaptcha function
const router = express.Router();

// Assuming you have a User model to validate email/password
const User = require('./models/User'); // Replace with your actual user model

router.post('/login', async (req, res) => {
  const { email, password, recaptchaValue } = req.body; // Expecting the reCAPTCHA token from frontend

  // Step 1: Verify reCAPTCHA
  const isRecaptchaValid = await verifyRecaptcha(recaptchaValue);

  if (!isRecaptchaValid) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
  }

  // Step 2: Proceed with your normal login logic
  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: 'User not found or invalid credentials' });
    }

    // If user found, return success response
    return res.status(200).json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
});

module.exports = router;
