import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [instructorName, setInstructorName] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState(null);

  const fetchServerQRCode = async () => {
    if (!instructorName) {
      alert("Please enter an instructor name!");
      return;
    }

    setLoading(true);
    try {
      const timeIn = moment().format('YYYY-MM-DD HH:mm:ss');
      const response = await axios.get('http://localhost:8000/api/qr-code', {
        params: {
          instructorName,
          timeIn,
        },
      });

      if (response.data.qrCodeUrl) {
        setServerData(response.data.qrCodeUrl);
      }
    } catch (error) {
      console.error('Error fetching QR code from server:', error);
      alert("Error fetching QR code from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!serverData && instructorName) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setQrData(JSON.stringify({ name: instructorName, timeIn: currentTime }));
    }
  }, [instructorName, serverData]);

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

      <div>
        {loading ? (
          <p>Loading QR code...</p>
        ) : serverData ? (
          <div>
            <p>QR Code fetched from Server</p>
            <img src={serverData} alt="Instructor QR Code" />
          </div>
        ) : (
          <div id="qr-code">
            <QRCode value={qrData} />
          </div>
        )}
      </div>

      <button onClick={fetchServerQRCode} className="btn btn-primary">Fetch Server QR Code</button>
      <button onClick={downloadQRCode} className="btn btn-success">Download QR Code</button>
    </div>
  );
};

export default QRCodeGenerator;
