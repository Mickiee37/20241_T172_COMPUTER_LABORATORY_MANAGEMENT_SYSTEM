const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing comparison
const { verifyRecaptcha } = require('../Services/verifyRecaptcha'); // reCAPTCHA verification function
const User = require('../models/User'); // Replace with your actual User model
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, recaptchaValue } = req.body;

  // Step 1: Verify reCAPTCHA
  const isRecaptchaValid = await verifyRecaptcha(recaptchaValue);
  if (!isRecaptchaValid) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
  }

  // Step 2: Validate email and password
  try {
    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Step 3: Login successful
    return res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, id: user._id },
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'An error occurred during login.' });
  }
});

module.exports = router;
