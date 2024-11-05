// LabCard.jsx
import React from 'react';
import './LabCard.css'; // Import LabCard-specific styles


const LabCard = ({ labNumber, currentUser }) => {
  return (
    <div className="lab-card">
      <div className="lab-header">
        <span>Comlab {labNumber}</span>
      </div>
      
      {currentUser ? (
        <div className="user-info">
          <p>{currentUser.name}</p>
          <p>Date: {currentUser.date}</p>
          <p>Time In: {currentUser.timeIn}</p>
        </div>
      ) : (
        <div className="empty-state">
          {/* This div will be empty if no one is using the Comlab */}
        </div>
      )}
    </div>
  );
};

export default LabCard;
