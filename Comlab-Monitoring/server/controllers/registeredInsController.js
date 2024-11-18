import express from 'express';
import { isValidPassword, hashPassword } from '../utils/utils.js';
import User from '../models/User.js';
import winston from 'winston';
import createTransporter from './createTransporter.js';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for token generation

const router = express.Router();

// Configure winston for logging
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Helper function to validate email format
const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@student\.buksu\.edu\.ph$/;
  return regex.test(email);
};

// Register route
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  logger.info('Instructor registration request received', { email });

  // Validate email format
  if (!isValidEmail(email)) {
    logger.warn('Invalid email format for instructor', { email });
    return res.status(400).json({
      message: 'Please enter a valid email address ending with @student.buksu.edu.ph',
    });
  }

  // Validate password format
  if (!isValidPassword(password)) {
    logger.warn('Invalid password format for instructor');
    return res.status(400).json({
      message: 'Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)',
    });
  }

  try {
    // Check if the instructor already exists
    const instructorExists = await User.findOne({ email });
    if (instructorExists) {
      logger.warn('Instructor already exists', { email });
      return res.status(400).json({ message: 'Instructor already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    logger.info('Instructor password hashed successfully');

    // Create new instructor
    const newInstructor = new User({
      email,
      password: hashedPassword,
      name,  // Save instructor's name in the database
    });

    // Save to the database
    await newInstructor.save();
    logger.info('Instructor registered successfully', { email });

    // Generate verification token
    newInstructor.verificationToken = uuidv4(); // Generate a unique token
    const verificationLink = `${process.env.REACT_APP_FRONTEND_URL}/verify-email?token=${newInstructor.verificationToken}`;

    // Send confirmation email after registration
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: 'Registration Successful',
      text: `Hello ${name},\n\nYour registration was successful. Welcome to the platform!`,
      html: `<p>Hello ${name},</p>\n<p>Your registration was successful. Welcome to the platform!</p><p><a href="${verificationLink}">Verify Email</a></p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info('Verification email sent successfully', { email });
      res.status(201).json({ message: 'Instructor registered successfully, email sent!' });
    } catch (emailError) {
      logger.error('Error sending email', { email, error: emailError.message });
      res.status(500).json({ message: 'Failed to send verification email.' });
    }
  } catch (error) {
    // Log and handle database or other internal errors
    logger.error('Error during instructor registration', { error: error.message });
    res.status(500).json({ message: 'Server error during registration' });
  }
});

export default router;