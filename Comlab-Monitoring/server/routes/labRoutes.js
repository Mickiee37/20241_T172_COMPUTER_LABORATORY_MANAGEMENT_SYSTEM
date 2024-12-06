import express from 'express';
import Lab from '../models/Lab.js'; // Your Lab model
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
        return res.status(400).json({ message: 'Invalid QR Code type' });
      }
  
      const lab = await Lab.findOne({ labNumber: parsedData.labNumber });
      if (!lab) {
        return res.status(404).json({ message: 'Lab not found' });
      }
  
      lab.status = 'open';
      await lab.save();
  
      // Notify the dashboard (WebSocket)
      notifyDashboard({
        type: 'labStatus',
        labNumber: lab.labNumber,
        status: 'open',
      });
  
      res.json({ message: `Lab ${lab.labNumber} is now open.` });
    } catch (error) {
      console.error('Error processing lab QR scan:', error);
      res.status(500).json({ message: 'Failed to process QR code for lab.', error });
    }
});

// Generate Lab Key QR Code (Admin function)
router.post('/generate-key', async (req, res) => {
    const { labNumber, qrValue } = req.body;
  
    if (!labNumber || !qrValue) {
      return res.status(400).json({ message: 'Missing labNumber or qrValue in the request body.' });
    }
  
    try {
      let lab = await Lab.findOne({ labNumber });
  
      if (!lab) {
        // If the lab doesn't exist, create it
        lab = new Lab({ labNumber, qrValue, status: 'closed', instructor: null });
      } else {
        // Update existing lab with a new QR value
        lab.qrValue = qrValue;
      }
  
      await lab.save();
      res.status(201).json({ message: 'Lab key QR code generated and saved.', lab });
    } catch (error) {
      console.error('Error generating lab key QR code:', error); // Log the detailed error
      res.status(500).json({ message: 'Failed to generate lab key QR code.' });
    }
});
// Validate lab number
router.get('/validate-lab/:labNumber', async (req, res) => {
  const { labNumber } = req.params;
  console.log('Lab Number:', labNumber);

  try {
      const lab = await Lab.findOne({ labNumber });
      console.log('Query Result:', lab);

      if (!lab) {
          return res.status(404).json({ message: `Lab ${labNumber} not found.` });
      }
      res.json({ success: true, lab });
  } catch (error) {
      console.error('Error fetching lab:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});
export default router;
