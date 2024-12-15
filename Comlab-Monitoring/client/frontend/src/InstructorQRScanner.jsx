import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import './InstructorQRScanner.css';

const InstructorQRScanner = ({ onScanSuccess }) => {
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      // When QR code is scanned, pass the data to parent component
      onScanSuccess(data);
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div className="scanner-container">
      <h2>Scan Instructor QR Code</h2>
      <QrReader
        delay={300}
        style={{ width: '100%' }}
        onError={handleError}
        onScan={handleScan}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InstructorQRScanner;
