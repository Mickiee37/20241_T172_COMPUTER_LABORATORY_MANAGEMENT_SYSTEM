import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState('instructor'); // 'instructor' or 'comlab'
  const [inputValue, setInputValue] = useState(''); // Input for Instructor ID or Lab Number
  const [qrData, setQrData] = useState(''); // QR Code content
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || (qrType === 'comlab' && (isNaN(trimmedInput) || trimmedInput < 1 || trimmedInput > 10))) {
      setErrorMessage(
        `Please enter a valid ${qrType === 'instructor' ? 'Instructor ID' : 'Lab Number (1–10)'}!`
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setQrData('');

    try {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

      if (qrType === 'instructor') {
        // Validate Instructor in the Database
        const response = await axios.get(`http://192.168.194.244:8000/api/instructor/${trimmedInput}`);

        if (response.status === 200 && response.data) {
          const instructor = response.data;

          // Create QR payload for instructor
          const qrPayload = JSON.stringify({
            type: 'instructor',
            instructorId: instructor.id,
            name: instructor.name,
            lastname: instructor.lastname,
            email: instructor.email,
            timestamp: currentTime,
          });

          setQrData(qrPayload);
          console.log('Generated Instructor QR Code Payload:', qrPayload);
        }
      } else if (qrType === 'comlab') {
        // Validate Lab Number
        const response = await axios.get(`http://192.168.194.244:8000/api/labs/validate-lab/${trimmedInput}`);

        if (response.status === 200) {
          const qrPayload = JSON.stringify({
            type: 'labKey',
            labNumber: trimmedInput,
            timestamp: currentTime,
          });
          setQrData(qrPayload);
          console.log('Generated Lab QR Code Payload:', qrPayload);
        } else {
          setErrorMessage(`Lab ${trimmedInput} does not exist.`);
        }
      }
    } catch (error) {
      console.error('Error fetching instructor or lab:', error.response?.data?.message || error.message);

      // Handle specific error message
      if (error.response?.status === 404) {
        setErrorMessage('Instructor does not exist.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qr-code');

    if (!qrCodeElement) {
      setErrorMessage('No QR code to download.');
      return;
    }

    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `${qrType}-${inputValue.trim()}-qr-code.png`;
      link.click();
    });
  };

  return (
    <div className="container">
      <div className="box">
        <h3>QR Code Generator</h3>
        <div className="form-group">
          <label htmlFor="qrType">Select QR Code Type:</label>
          <select
            id="qrType"
            value={qrType}
            onChange={(e) => setQrType(e.target.value)}
            className="form-control"
          >
            <option value="instructor">Instructor</option>
            <option value="comlab">Comlab</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="inputValue">
            Enter {qrType === 'instructor' ? 'Instructor ID' : 'Lab Number'}:
          </label>
          <input
            id="inputValue"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${qrType === 'instructor' ? 'Instructor ID' : 'Lab Number (1–10)'}`}
            className="form-control"
          />
        </div>
        <p>Time: {moment().format('YYYY-MM-DD HH:mm:ss')}</p>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div id="qr-code" className="qr-code-container">
          {loading ? (
            <p>Loading QR code...</p>
          ) : (
            qrData && <QRCode value={qrData} />
          )}
        </div>
        <button onClick={generateQRCode} className="btn btn-primary">
          Generate QR Code
        </button>
        <button onClick={downloadQRCode} className="btn btn-success" disabled={!qrData}>
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
