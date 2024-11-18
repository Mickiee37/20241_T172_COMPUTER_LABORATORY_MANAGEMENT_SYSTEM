import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QRCodeGenerator.css';
import { IoPersonSharp } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { MdHistory } from "react-icons/md";
import { FaQrcode } from 'react-icons/fa'; // Import QR code icon from FontAwesome
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation






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
  const navigate = useNavigate(); // React Router's useNavigate for redirection

  const handleLogout = () => {
    // Redirect to the usertype selection menu
    navigate('/');
  };
  return (
    <div className="container">
            {/* Navbar */}
<nav className="navbar fixed-top navbar-expand-lg bg-black">
  <div className="container">
    {/* Left: Brand */}
    <a className="navbar-brand text-white">Computer Laboratory Monitoring System</a>
    {/* Center: Icons and Labels */}
    <div className="navbar-center">
    <Link to="/Dashboard" className="navbar-item">
    <RiComputerLine className="icon computer-icon" />
    <span className="icon-label">Computer Lab</span>
    </Link>
      <Link to="/app" className="navbar-item">
        <IoPersonSharp className="icon person-icon" />
        <span className="icon-label">Instructor Menu</span>
      </Link>
      <Link to="/qr-code" className="navbar-item">
        <FaQrcode className="icon qr-icon" />
        <span className="icon-label">QR Generator</span>
      </Link>
      <Link to="/qr-code" className="navbar-item">
      <MdHistory className="icon history-icon" />
      <span className="icon-label">History Log</span>
    </Link>
    </div>
    {/* Right: Logout Button */}
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  </div>
</nav>
    
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
    </div>      
  );
};

export default QRCodeGenerator;
