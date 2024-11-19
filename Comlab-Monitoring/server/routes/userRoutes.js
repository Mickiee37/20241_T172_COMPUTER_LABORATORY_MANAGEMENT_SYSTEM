import express from 'express';
import User from '../models/User.js';
import winston from 'winston';  // Optional: for better logging
import { isValidPassword, hashPassword, comparePassword } from '../utils/utils.js';
import { sendVerificationEmail } from '../Services/emailService.js';  // Import email service
import { v4 as uuidv4 } from 'uuid';  // For generating a unique verification token

const router = express.Router();

// Configure winston (optional)
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  logger.info('Registration request received', { email });

  // Domain check for the allowed email domains
  const allowedDomains = ['student.buksu.edu.ph', 'buksu.edu.ph'];
  const emailDomain = email.split('@')[1];

  if (!allowedDomains.includes(emailDomain)) {
    logger.warn('Invalid email domain', { email });
    return res.status(400).json({ message: 'Email must be from @student.buksu.edu.ph or @buksu.edu.ph domain' });
  }

  // Validate the password
  if (!isValidPassword(password)) {
    logger.warn('Invalid password format');
    return res.status(400).json({
      message:
        'Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)',
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn('User  already exists', { email });
      return res.status(400).json({ message: 'User  already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    logger.info('Password hashed successfully');

    // Create a new user object
    const newUser  = new User({
      email,
      password: hashedPassword,
      isVerified: false,  // Set to false initially
    });

    // Generate verification token
    newUser .generateVerificationToken(); // Generate token here

    // Save the new user
    await newUser .save();
    logger.info('User  registered successfully', { email });

    // Generate the verification link
    const verificationLink = `http://localhost:3000/verify-email?token=${newUser.verificationToken}`;

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationLink);
      logger.info('Verification email sent', { email });
    } catch (emailError) {
      logger.error('Error sending verification email', emailError);
      return res.status(500).json({ message: 'User  registered, but failed to send verification email.' });
    }

    res.status(201).json({ message: 'User  registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    logger.error('Error during registration', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Login route
router.post('/check-user', async (req, res) => {
  const { email, password } = req.body;
  logger.info('Login attempt', { email });

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Fetch user from the database
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      logger.warn('User  not found', { email });
      return res.status(404).json({ message: 'User  not found' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      logger.warn('Unverified user attempt', { email });
      return res.status(403).json({ message: 'Account not verified. Please check your email.' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logger.warn('Invalid credentials', { email });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    logger.info('Login successful', { email });
    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    logger.error('Error during login', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;  // Use req.query for GET requests

  console.log('Verification request received with token:', token); // Logging the token for debugging

  try {
    // Find the user by verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User  not found with this verification token.' });
    }

    // Check if the token has expired
    if (user.isVerificationTokenExpired()) {
      return res.status(400).json({ success: false, message: 'Verification token has expired. Please request a new one.' });
    }

    // Proceed with account verification
    user.isVerified = true;
    user.verificationToken = null;  // Clear the verification token
    user.verificationTokenExpires = null;  // Clear the expiration date

    await user.save();
    res.status(200).json({ success: true, message: 'Account verified successfully.' });
  } catch (error) {
    console.error('Error during email verification', error);
    res.status(500).json({ success: false, message: 'Server error during email verification' });
  }
});

export default router;