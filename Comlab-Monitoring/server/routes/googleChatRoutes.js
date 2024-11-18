import express from 'express';
import { sendMessageToChat, listSpaces } from '../Services/googleChatService.js';

const router = express.Router();

// Route to send a message
router.post('/send', async (req, res) => {
    try {
        const { message, spaceId } = req.body;
        if (!message || !spaceId) {
            return res.status(400).json({ error: 'Message and spaceId are required' });
        }
        const result = await sendMessageToChat(message, spaceId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to list available spaces
router.get('/spaces', async (req, res) => {
    try {
        const spaces = await listSpaces();
        res.json(spaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
