// server/routes/googleChatTest.js
import express from 'express';
import { google } from 'googleapis';
import { sendMessageToChat } from '../Services/googleChatService.js'; // Your service to send messages

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CHAT_CLIENT_ID,
    process.env.GOOGLE_CHAT_CLIENT_SECRET,
    process.env.GOOGLE_CHAT_REDIRECT_URI
);

// Route to initiate Google OAuth flow
router.get('/test/google-chat', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/chat.bot'], // Scope for Google Chat API
    });

    res.redirect(authUrl); // Redirect user to Google's OAuth 2.0 server
});

// Callback route for Google OAuth
router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens); // Set the credentials

        // Send a test message to Google Chat
        const message = 'Hello from your application!';
        const spaceId = 'your_space_id'; // Replace with your Google Chat space ID
        await sendMessageToChat(message, spaceId);

        res.send('Authentication successful! Message sent to Google Chat.');
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication.');
    }
});

export default router;