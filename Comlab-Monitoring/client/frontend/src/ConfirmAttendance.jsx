// ConfirmAttendance.jsx
import React from 'react';

const ConfirmAttendance = ({ attendanceLog }) => {
  if (!attendanceLog) return null;

  return (
    <div className="attendance-confirmation">
      <h4>Attendance Confirmation</h4>
      <p>Instructor Name: {attendanceLog.instructorName}</p>
      <p>Time In: {attendanceLog.timeIn}</p>
      {attendanceLog.timeOut && <p>Time Out: {attendanceLog.timeOut}</p>}
      <p>Attendance logged successfully!</p>
    </div>
  );
};

export default ConfirmAttendance;
