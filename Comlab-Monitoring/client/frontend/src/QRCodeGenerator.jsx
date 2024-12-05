import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState('instructor'); // 'instructor' or 'key'
  const [inputValue, setInputValue] = useState(''); // Either instructor name or lab key
  const [qrData, setQrData] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!inputValue) {
      setErrorMessage(`Please enter a ${qrType === 'instructor' ? 'Instructor Name' : 'Lab Number'}!`);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

      if (qrType === 'instructor') {
        // Generate QR code URL for the backend
        const qrValue = `http://192.168.255.244:8000/api/qr-code/scan?name=${encodeURIComponent(
          inputValue
        )}&timeIn=${encodeURIComponent(currentTime)}`;

        console.log('Generated QR Code Data:', qrValue); // Debug
        setQrData(qrValue); // Set the QR data state for QRCode component
      } else if (qrType === 'key') {
        const qrValue = JSON.stringify({
          type: 'labKey',
          labNumber: inputValue,
          generatedAt: currentTime,
        });

        console.log('Generated Lab Key QR Data:', qrValue); // Debug
        setQrData(qrValue); // Set the QR data state for QRCode component
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setErrorMessage('Error generating QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qr-code');

    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `${qrType}-qr-code.png`;
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
            <option value="key">Lab Key</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="inputValue">
            Enter {qrType === 'instructor' ? 'Instructor Name' : 'Lab Number'}:
          </label>
          <input
            id="inputValue"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${qrType === 'instructor' ? 'Instructor Name' : 'Lab Number'}`}
            className="form-control"
          />
        </div>
        <p>Time: {moment().format('YYYY-MM-DD HH:mm:ss')}</p>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div id="qr-code">
          {loading ? (
            <p>Loading QR code...</p>
          ) : (
            qrData && <QRCode value={qrData} />
          )}
        </div>
        <button onClick={generateQRCode} className="btn btn-primary">
          Generate QR Code
        </button>
        <button onClick={downloadQRCode} className="btn btn-success">
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
