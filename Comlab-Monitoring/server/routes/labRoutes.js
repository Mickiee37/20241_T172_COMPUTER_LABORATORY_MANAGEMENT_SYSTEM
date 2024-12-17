import express from 'express';
import Lab from '../models/Lab.js'; // Your Lab model
import mongoose from 'mongoose';
import { notifyDashboard } from '../webSocket/websocket.js'; // WebSocket notification if required

const router = express.Router();

// Mark lab as open (via Lab QR Code)
router.post('/lab/open', async (req, res) => {
    const { labName } = req.body;
  
    try {
      const lab = await Lab.findOne({ labName });
      if (!lab) return res.status(404).json({ message: 'Lab not found' });
  
      // Open the lab and reset instructor information
      lab.status = 'open';
      lab.instructor = null; // Reset instructor
      lab.timeIn = null; // Reset time
      await lab.save();
  
      res.json({ message: 'Lab marked as open', lab });
    } catch (error) {
      console.error('Error marking lab as open:', error);
      res.status(500).json({ message: 'Error marking lab as open', error });
    }
});

// Handle Instructor QR Code scan to assign to a lab
router.post('/scan-instructor', async (req, res) => {
    const { qrData, labNumber } = req.body;
  
    try {
      const parsedData = JSON.parse(qrData);
      const lab = await Lab.findOne({ labNumber });
      if (!lab || lab.status !== 'open') {
        return res.status(400).json({ message: 'Lab is not open or does not exist.' });
      }
  
      lab.instructor = parsedData.name; // Assign instructor name
      lab.timeIn = new Date(); // Log time in
      lab.status = 'occupied';
      await lab.save();
  
      res.json({
        message: `Instructor ${parsedData.name} is now using Lab ${labNumber}.`,
        lab,
      });
    } catch (error) {
      console.error('Error processing instructor QR scan:', error);
      res.status(500).json({ message: 'Failed to process QR code for instructor.', error });
    }
});

// Open Lab by scanning Lab QR Code
router.post('/scan-lab', async (req, res) => {
  const { qrData } = req.body;

  try {
    const parsedData = JSON.parse(qrData);

    if (parsedData.type !== 'labKey') {
      return res.status(400).json({ message: 'Invalid QR Code type.' });
    }

    const lab = await Lab.findOne({ labNumber: parsedData.labNumber });
    if (!lab) return res.status(404).json({ message: `Lab ${parsedData.labNumber} not found.` });

    // Mark the lab as open
    lab.status = 'open';
    await lab.save();

    res.json({ message: `Lab ${parsedData.labNumber} is now open.`, lab });
  } catch (error) {
    console.error('Error scanning lab QR code:', error);
    res.status(500).json({ message: 'Failed to process QR code for lab.' });
  }
});
// Generate Lab Key QR Code (Admin function)
router.post('/generate-key', async (req, res) => {
  const { labNumber } = req.body;

  try {
    const lab = await Lab.findOne({ labNumber });
    if (!lab) {
      return res.status(404).json({ message: `Lab ${labNumber} does not exist.` });
    }

    // Generate QR Code Payload
    const qrPayload = JSON.stringify({
      type: 'labKey',
      labNumber: labNumber,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      message: `QR code for Lab ${labNumber} generated successfully.`,
      qrData: qrPayload,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Error generating QR code.' });
  }
});

// Validate lab number
router.get('/validate-lab/:labNumber', async (req, res) => {
  const { labNumber } = req.params;

  try {
    console.log('Received Lab Number:', labNumber);

    // Clean and prepare the lab number
    const cleanLabNumber = labNumber.replace(/Comlab\s*/i, '').trim();
    console.log('Cleaned Lab Number:', cleanLabNumber);

    // Explicitly apply collation to Mongoose query
    const lab = await Lab.findOne(
      { labNumber: cleanLabNumber },
      null, // No projection
      { collation: { locale: 'en', strength: 2 } } // Case-insensitive matching
    );

    console.log('MongoDB Query Result:', lab);

    if (!lab) {
      return res.status(404).json({ message: `Lab ${cleanLabNumber} does not exist.` });
    }

    res.json({ success: true, lab });
  } catch (error) {
    console.error('Error validating lab:', error);
    res.status(500).json({ message: 'Internal server error while validating lab.' });
  }
});
export default router;