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
    timestamps: true, // Will add createdAt and updatedAt automatically
  }
);

// Create the model for the attendance log
const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema);

export default AttendanceLog;
