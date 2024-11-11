import express from 'express';
import AttendanceLog from '../models/AttendanceLog.js';
import QRCode from 'qrcode'; // QR Code generation library

const router = express.Router();

// Route to log attendance
router.post('/attendance', async (req, res) => {
  const { instructorId, timeIn } = req.body;

  // Validate input
  if (!instructorId || !timeIn) {
    return res.status(400).json({ message: 'Instructor ID and timeIn are required.' });
  }

  try {
    const attendanceLog = new AttendanceLog({
      instructor: instructorId,
      timeIn: new Date(timeIn),
    });

    await attendanceLog.save();
    res.status(201).json({ message: 'Attendance logged successfully', attendanceLog });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).json({ message: 'Failed to log attendance. Please try again later.' });
  }
});

// Optional: Route to update timeOut
router.patch('/attendance/:id', async (req, res) => {
  const { id } = req.params;
  const { timeOut } = req.body;

  if (!timeOut) {
    return res.status(400).json({ message: 'timeOut is required.' });
  }

  try {
    const attendanceLog = await AttendanceLog.findByIdAndUpdate(
      id,
      { timeOut: new Date(timeOut) },
      { new: true }
    );

    if (!attendanceLog) {
      return res.status(404).json({ message: 'Attendance log not found.' });
    }

    res.status(200).json({ message: 'Time out logged successfully', attendanceLog });
  } catch (error) {
    console.error('Error updating time out:', error);
    res.status(500).json({ message: 'Failed to update time out. Please try again later.' });
  }
});

// Route to generate a QR code
router.get('/api/qr-code', async (req, res) => {
  const { instructorName, timeIn } = req.query;

  // Validate the incoming query parameters
  if (!instructorName || !timeIn) {
    return res.status(400).json({ message: 'Instructor name and timeIn are required.' });
  }

  try {
    const qrCodeUrl = await QRCode.toDataURL(`Name: ${instructorName}, Time In: ${timeIn}`);
    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Failed to generate QR code.' });
  }
});

export default router;
