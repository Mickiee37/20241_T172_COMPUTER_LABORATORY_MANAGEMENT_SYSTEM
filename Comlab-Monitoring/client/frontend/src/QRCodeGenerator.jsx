import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState('instructor'); // 'instructor' or 'comlab'
  const [inputValue, setInputValue] = useState(''); // Either instructor name or lab number
  const [qrData, setQrData] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!inputValue) {
      setErrorMessage(
        `Please enter a ${qrType === 'instructor' ? 'Instructor Name' : 'Lab Number'}!`
      );
      return;
    }
  
    setLoading(true);
    setErrorMessage(null);
    setQrData(''); // Clear previous QR code
  
    try {
      if (qrType === 'comlab') {
        // Validate the lab number with the backend
        const response = await axios.get(
          `http://192.168.100.4:8000/api/labs/validate-lab/${inputValue}`
        );
  
        if (response.status === 200) {
          // Backend confirms the lab exists
          const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const qrValue = `http://192.168.100.4:8000/api/comlab/open?labNumber=${encodeURIComponent(
            inputValue
          )}&timestamp=${encodeURIComponent(currentTime)}`;
          console.log('Generated QR Code Data:', qrValue);
          setQrData(qrValue); // Set the QR code value for rendering
        }
      } else if (qrType === 'instructor') {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const qrValue = `http://192.168.100.4:8000/api/qr-code/scan?name=${encodeURIComponent(
          inputValue
        )}&timeIn=${encodeURIComponent(currentTime)}`;
        setQrData(qrValue);
      }
    } catch (error) {
      // Handle errors from the backend validation
      if (error.response && error.response.status === 404) {
        setErrorMessage(`Lab ${inputValue} does not exist.`);
      } else {
        setErrorMessage('Error generating QR code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qr-code');

    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `${qrType}-${inputValue}-qr-code.png`;
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
        <button onClick={downloadQRCode} className="btn btn-success" disabled={!qrData}>
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
