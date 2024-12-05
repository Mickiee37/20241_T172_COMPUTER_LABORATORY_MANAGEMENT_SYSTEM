import express from 'express';
import { generateInstructorQR, generateKeyQR, scanQRCode } from '../controllers/qrController.js';

const router = express.Router();

// Route to generate QR Code for instructors
router.post('/instructor', generateInstructorQR);

// Route to generate QR Code for keys
router.post('/key', generateKeyQR);

// Route to handle QR code scanning and logging timestamp
router.post('/scan', scanQRCode);

export default router;
