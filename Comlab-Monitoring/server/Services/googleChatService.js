import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const chat = google.chat('v1');

// Function to send a message to Google Chat
export const sendMessageToChat = async (message, spaceId) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CHAT_CLIENT_ID,
        process.env.GOOGLE_CHAT_CLIENT_SECRET,
        process.env.GOOGLE_CHAT_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    try {
        const response = await chat.spaces.messages.create({
            auth: oauth2Client,
            parent: `spaces/${spaceId}`,
            requestBody: {
                text: message,
            },
        });
        console.log('Message sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error.message);
        throw new Error(`Failed to send message to Google Chat: ${error.message}`);
    }
};

// Function to list available spaces
export const listSpaces = async () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CHAT_CLIENT_ID,
        process.env.GOOGLE_CHAT_CLIENT_SECRET,
        process.env.GOOGLE_CHAT_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    try {
        const response = await chat.spaces.list({
            auth: oauth2Client,
        });
        return response.data.spaces;
    } catch (error) {
        console.error('Error listing spaces:', error.message);
        throw new Error(`Failed to list Google Chat spaces: ${error.message}`);
    }
};
