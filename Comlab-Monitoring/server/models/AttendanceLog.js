import mongoose from 'mongoose';
const { Schema } = mongoose;

const attendanceLogSchema = new Schema(
  {
    instructor: { 
      type: mongoose.Schema.Types.ObjectId,  // Reference to Instructor model
      ref: 'Instructor',
      required: true 
    },
    timeIn: { 
      type: Date, 
      required: true 
    },
    timeOut: { 
      type: Date 
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create the model for the attendance log
const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema);

export default AttendanceLog;
