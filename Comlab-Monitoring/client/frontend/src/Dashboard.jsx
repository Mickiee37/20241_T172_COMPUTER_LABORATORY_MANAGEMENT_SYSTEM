// Dashboard.jsx
import React from 'react';
import LabCard from './LabCard';
import './dashboard.css'; // Import dashboard-specific styles
import PersonIcon from './PersonIcon'; // Import the PersonIcon component

const Dashboard = () => {
  const labData = [
    { labNumber: 1, currentUser: null },
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
      <div className="icon-container"> {/* New div for positioning */}
        <PersonIcon className="person-icon" />
      </div>
      {labData.map((lab) => (
        <LabCard key={lab.labNumber} labNumber={lab.labNumber} currentUser={lab.currentUser} />
      ))}
    </div>
  );
};

export default Dashboard;
