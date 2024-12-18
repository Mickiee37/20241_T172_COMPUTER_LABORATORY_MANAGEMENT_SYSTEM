import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState('instructor'); // 'instructor' or 'comlab'
  const [inputValue, setInputValue] = useState(''); // Instructor name or lab number
  const [qrData, setQrData] = useState(''); // Holds the generated QR Code value
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
  const trimmedInput = inputValue.trim(); // Trim any extra whitespace
  if (!trimmedInput || (qrType === 'comlab' && (isNaN(trimmedInput) || trimmedInput < 1 || trimmedInput > 10))) {
    setErrorMessage(
      `Please enter a valid ${qrType === 'instructor' ? 'Instructor Name' : 'Lab Number (1–10)'}!`
    );
    return;
  }

  setLoading(true);
  setErrorMessage(null);
  setQrData(''); 

  try {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (qrType === 'comlab') {
      // Backend API call to validate lab number
      const response = await axios.get(
        `http://192.168.194.244:8000/api/labs/validate-lab/${trimmedInput}`
      );

      if (response.status === 200) {
        // Create QR payload for lab
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
    } else if (qrType === 'instructor') {
      // Create instructor QR URL
      const qrValue = `http://192.168.194.244:8000/api/qr-code/scan?name=${encodeURIComponent(
        trimmedInput
      )}&timeIn=${encodeURIComponent(currentTime)}`;

      setQrData(qrValue);
      console.log('Generated Instructor QR Code:', qrValue);
    }
  } catch (error) {
    console.error('Error generating QR code:', error.message);

    if (error.response && error.response.status === 404) {
      setErrorMessage(`Lab ${trimmedInput} does not exist.`);
    } else {
      setErrorMessage('Error generating QR code. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
const downloadQRCode = () => {
  const qrCodeElement = document.getElementById('qr-code');

  // Check if QR code exists before downloading
  if (!qrCodeElement) {
    setErrorMessage('No QR code to download.');
    return;
  }

  // Capture the QR code element as an image and download
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
            Enter {qrType === 'instructor' ? 'Instructor Name' : 'Lab Number'}:
          </label>
          <input
            id="inputValue"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${qrType === 'instructor' ? 'Instructor Name' : 'Lab Number (1–10)'}`}
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
        <button onClick={downloadQRCode} className="btn btn-success" disabled={!qrData}>
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;