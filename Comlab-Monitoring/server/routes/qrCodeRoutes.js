// qrCodeRoutes.js
import express from 'express';
import { generateQRCode } from '../controllers/qrCodeController.js'; // Correct named import

const router = express.Router();

// Define the route for generating the QR code
router.get('/', generateQRCode);  // This matches '/api/qr-code' on the backend

export default router;
