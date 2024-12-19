import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas'; // Import html2canvas

const QRCodeGenerator = () => {
  const [instructorName, setInstructorName] = useState('');
  const [qrData, setQrData] = useState(''); // Data for frontend-generated QR code
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState(null); // Data fetched from the server

  // Handle QR Code generation
  const fetchServerQRCode = async () => {
    if (!instructorName) {
      alert("Please enter an instructor name!");
      return;
    }

    setLoading(true);
    try {
      const timeIn = moment().format('YYYY-MM-DD HH:mm:ss');
      // Send request to the backend to generate the QR code
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

  // Handle download of the QR code as an image
  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qr-code'); // Get the QR code element

    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL(); // Get image data
      link.download = 'qr-code.png'; // Set download filename
      link.click(); // Trigger the download
    });
  };

  return (
    <div>
      <h3>Enter Instructor Name:</h3>
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
          <div>
            <p>QR Code generator</p>
            <div id="qr-code"> {/* Add an id for capturing the QR code */}
              <QRCode value={qrData} />
            </div>
          </div>
        )}
      </div>

      <button onClick={fetchServerQRCode} className="btn btn-primary">Fetch Server QR Code</button>
      <button onClick={downloadQRCode} className="btn btn-success mt-3">Download QR Code</button>
    </div>
  );
};

export default QRCodeGenerator;
