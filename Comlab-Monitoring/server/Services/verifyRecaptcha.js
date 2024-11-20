// verifyRecaptcha.js
const axios = require('axios');

// Function to verify reCAPTCHA response
const verifyRecaptcha = async (recaptchaValue) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Replace with your actual secret key from the reCAPTCHA console
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaValue}`;

  try {
    const response = await axios.post(url);
    return response.data.success; // Returns true if reCAPTCHA is valid
  } catch (err) {
    console.error('Error verifying reCAPTCHA:', err);
    return false; // If verification fails, return false
  }
};

module.exports = { verifyRecaptcha };
