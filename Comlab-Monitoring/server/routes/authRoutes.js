import express from 'express';
import { google } from 'googleapis';
import createTransporter from '../Services/createTransporter.js'; // Ensure the path is correct

// Initialize OAuth2 client with your credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,       // Your Google client ID
  process.env.GOOGLE_CLIENT_SECRET,   // Your Google client secret
  process.env.GOOGLE_REDIRECT_URI     // Your redirect URI
);

const router = express.Router();

// Route to handle Google callback and exchange authorization code for tokens
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;  // The authorization code returned by Google

  try {
    // Exchange the authorization code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);  // Store the tokens in the OAuth2 client

    // Log the refresh token for initial setup (use it in future requests)
    console.log('Refresh Token:', tokens.refresh_token);

    // Store the refresh token securely in your environment (e.g., .env file or database)
    process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token; // Store it temporarily for now

    // Now that we have the refresh token, create the transporter
    const transporter = await createTransporter();  // Use the transporter you have already set up

    // Use the transporter to send emails (example)
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: 'recipient@example.com',  // Use the actual recipient email
      subject: 'Test Email',
      text: 'This is a test email sent using OAuth2.',
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Failed to send email.');
      }
      console.log('Email sent:', info.response);
      res.send('Email sent successfully!');
    });

  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Error during authentication.');
  }
});

export default router;
