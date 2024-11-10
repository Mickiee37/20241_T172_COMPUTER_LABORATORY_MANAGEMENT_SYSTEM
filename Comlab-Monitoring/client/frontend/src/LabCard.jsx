import React from 'react';
import './LabCard.css';
import moment from 'moment';

const LabCard = ({ labNumber, currentUser }) => {
  return (
    <div className="lab-card">
      <div className="lab-header">
        <span>Comlab {labNumber}</span>
      </div>
      
      {currentUser ? (
        <div className="user-info">
          <p>{currentUser.name}</p>
          <p>
            Date: {currentUser.timeIn ? moment(currentUser.timeIn).format('MMMM Do YYYY') : 'N/A'}
          </p>
          <p>
            Time In: {currentUser.timeIn ? moment(currentUser.timeIn).format('h:mm A') : 'N/A'}
          </p>
        </div>
      ) : (
        <div className="empty-state">
          <p>No one is using this lab</p>
        </div>
      )}
    </div>
  );
};

export default LabCard;
