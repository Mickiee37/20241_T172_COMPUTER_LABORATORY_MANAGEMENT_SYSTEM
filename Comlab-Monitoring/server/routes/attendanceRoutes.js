import express from 'express';
import AttendanceLog from '../models/AttendanceLog.js'; // Import the AttendanceLog model

const router = express.Router();

// Route to log attendance
router.post('/', async (req, res) => {
  const { instructorId, timeIn } = req.body;

  if (!instructorId || !timeIn) {
    return res.status(400).json({ message: 'Instructor ID and timeIn are required.' });
  }

  try {
    const attendanceLog = new AttendanceLog({
      instructor: instructorId,  // Reference to Instructor model
      timeIn: new Date(timeIn),
    });

    await attendanceLog.save();
    res.status(201).json({ message: 'Attendance logged successfully', attendanceLog });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).json({ message: 'Failed to log attendance' });
  }
});

export default router;
