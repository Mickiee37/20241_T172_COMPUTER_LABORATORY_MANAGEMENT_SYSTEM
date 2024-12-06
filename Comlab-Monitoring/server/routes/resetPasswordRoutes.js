import express from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';

const router = express.Router();

const SEMAPHORE_API_URL = `https://api.semaphore.co/api/v4/messages`; // Semaphore API URL
const API_KEY = 'a61656a941875a02af6535da52cb3c98'; // Replace with your Semaphore API key

let otpStore = {}; // Temporary in-memory OTP store

// Helper: Validate phone number format
const isValidPhoneNumber = (phoneNumber) => /^(\+639)\d{9}$/.test(phoneNumber);

// Helper: Generate a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Step 1: Send OTP
router.post("/send-reset-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!isValidPhoneNumber(phoneNumber)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format. Use +639XXXXXXXXX." });
  }

  const otp = generateOtp(); // Generate OTP

  try {
    // Send OTP via Semaphore API
    const response = await axios.post(
      SEMAPHORE_API_URL,
      {
        apikey: API_KEY,
        number: phoneNumber,
        message: `Your OTP is ${otp}. Please use it within 5 minutes.`,
        sendername: "CAgriAlert", // Replace with your approved sender name
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log the Semaphore API response for debugging
    console.log("Semaphore API Response:", JSON.stringify(response.data, null, 2));

    // Check API response for success
    if (response.data.status === 'success') {
      otpStore[phoneNumber] = otp; // Store OTP temporarily
      setTimeout(() => delete otpStore[phoneNumber], 300000); // Clear OTP after 5 minutes
      res.json({ success: true, message: "OTP sent successfully." });
    } else {
      console.error("Semaphore API Error Response:", response.data);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP.",
        error: response.data,
      });
    }
  } catch (err) {
    console.error("Error sending OTP:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Error sending OTP.",
      error: err.response?.data || err.message,
    });
  }
});

// Step 2: Verify OTP
router.post('/verify-reset-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!isValidPhoneNumber(phoneNumber)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid phone number format. Use +639XXXXXXXXX.' });
  }

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
  }

  if (otpStore[phoneNumber] === parseInt(otp, 10)) {
    delete otpStore[phoneNumber]; // Clear OTP after verification
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
});

// Step 3: Reset Password
router.post('/reset-password', async (req, res) => {
  const { phoneNumber, newPassword } = req.body;

  if (!isValidPhoneNumber(phoneNumber)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid phone number format. Use +639XXXXXXXXX.' });
  }

  if (!phoneNumber || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'Phone number and new password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    // Replace with your actual database update logic
    console.log(`Password for ${phoneNumber} updated to: ${hashedPassword}`);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
});

export default router;
