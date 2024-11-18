// routes/attendanceRoutes.js
import express from 'express';
import AttendanceLog from '../models/AttendanceLog.js';
import Instructor from '../models/instructor.js';

const router = express.Router();

router.post('/attendance', async (req, res) => {
  const { instructorName, timeIn } = req.body;

  if (!instructorName || !timeIn) {
    return res.status(400).json({ message: 'Instructor name and timeIn are required.' });
  }

  try {
    const instructor = await Instructor.findOne({ name: instructorName });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found.' });
    }

    let attendanceLog = await AttendanceLog.findOne({
      instructor: instructor._id,
      timeOut: { $exists: false },
    });

    if (attendanceLog) {
      attendanceLog.timeOut = new Date();
    } else {
      attendanceLog = new AttendanceLog({
        instructor: instructor._id,
        timeIn: new Date(timeIn),
      });
    }

    await attendanceLog.save();
    res.status(201).json({ message: 'Attendance logged successfully', attendanceLog });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).json({ message: 'Failed to log attendance.' });
  }
});

export default router;
