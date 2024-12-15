import React from 'react';
import PropTypes from 'prop-types';

const LabCard = ({ labNumber, currentUser }) => {
  const hasUser = !!currentUser;

  return (
    <div className="lab-card">
      <h2>Comlab {labNumber}</h2>
      {hasUser ? (
        <>
          <h3>{currentUser.name || 'Unknown Instructor'}</h3>
          <p>Date: {currentUser.date || 'N/A'}</p>
          <p>Time In: {currentUser.timeIn || 'N/A'}</p>
        </>
      ) : (
        <p className="no-user">This lab is currently available.</p>
      )}
    </div>
  );
};

// PropTypes validation
LabCard.propTypes = {
  labNumber: PropTypes.number.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    timeIn: PropTypes.string,
  }),
};

export default LabCard;
