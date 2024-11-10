// Dashboard.jsx
import React from 'react';
import LabCard from './LabCard';
import './dashboard.css';
import PersonIcon from './PersonIcon';

const Dashboard = () => {
  const labData = [
    { labNumber: 1, currentUser:{ name: 'JAYSON TUBEO', timeIn: '2024-11-11 09:00' } },
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
      {/* Wrapper div to position the icon in the upper right */}
      <div className="icon-wrapper">
        <PersonIcon className="person-icon" />
      </div>
      {labData.map((lab) => (
        <LabCard key={lab.labNumber} labNumber={lab.labNumber} currentUser={lab.currentUser} />
      ))}
    </div>
  );
};

export default Dashboard;
