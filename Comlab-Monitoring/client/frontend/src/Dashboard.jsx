import React from 'react';
import LabCard from './LabCard';
import './dashboard.css';
import PersonIcon from './PersonIcon'; // Import the custom PersonIcon component
import { FaQrcode } from 'react-icons/fa'; // Import QR code icon from FontAwesome
import { Link } from 'react-router-dom'; // Import Link for navigation

const Dashboard = () => {
  const labData = [
    { labNumber: 1, currentUser: { name: 'JAYSON TUBEO', timeIn: '2024-11-11 09:00' } },
    { labNumber: 2, currentUser: null },
    { labNumber: 3, currentUser: null },
    { labNumber: 4, currentUser: null },
    { labNumber: 5, currentUser: null },
    { labNumber: 6, currentUser: null },
    { labNumber: 7, currentUser: null },
    { labNumber: 8, currentUser: null },
    { labNumber: 9, currentUser: null },
    { labNumber: 10, currentUser: null },
  ];

  return (
    <div className="dashboard">
      {/* Wrapper div for positioning icons */}
      <div className="icon-wrapper">
        {/* Person Icon */}
        <PersonIcon className="person-icon" />

        {/* QR Code Icon with a Link to /qr-code */}
        <Link to="/qr-code">
          <FaQrcode className="qr-icon" size={40} />
        </Link>
      </div>

      {/* Render Lab Cards */}
      {labData.map((lab) => (
        <LabCard key={lab.labNumber} labNumber={lab.labNumber} currentUser={lab.currentUser} />
      ))}
    </div>
  );
};

export default Dashboard;
