import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import ConfirmAttendance from './ConfirmAttendance';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [instructorName, setInstructorName] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState(null);

  const serverBaseUrl = 'http://localhost:8000/api/qr-code';

  const generateQRCodeAndLogAttendance = async () => {
    if (!instructorName) {
      alert("Please enter an instructor name!");
      return;
    }

    setLoading(true);
    const timeIn = moment().format('YYYY-MM-DD HH:mm:ss');
    const qrCodeData = { name: instructorName, timeIn, date: moment().format('YYYY-MM-DD') };

    setQrData(JSON.stringify(qrCodeData));
    try {
      const response = await axios.post(`${serverBaseUrl}/attendance`, {
        instructorName,
        timeIn,
      });
      
      // Update attendanceLog state with the response data for confirmation
      setAttendanceLog({ instructorName, timeIn });

      alert('Attendance logged successfully!');
    } catch (error) {
      console.error('Error logging attendance:', error);
      alert('Failed to log attendance. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qr-code');
    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'qr-code.png';
      link.click();
    });
  };

  return (
    <div className="box">
      <input
        type="text"
        value={instructorName}
        onChange={(e) => setInstructorName(e.target.value)}
        placeholder="Enter Instructor Name"
        className="form-control"
      />
      <p>Time In: {moment().format('YYYY-MM-DD HH:mm:ss')}</p>
      <div id="qr-code">
        <QRCode value={qrData} />
      </div>
      <button onClick={generateQRCodeAndLogAttendance} className="btn btn-primary">
        Generate QR Code and Log Attendance
      </button>
      <button onClick={downloadQRCode} className="btn btn-success">Download QR Code</button>

      {/* Render attendance confirmation */}
      <ConfirmAttendance attendanceLog={attendanceLog} />
    </div>
  );
};

export default QRCodeGenerator;
