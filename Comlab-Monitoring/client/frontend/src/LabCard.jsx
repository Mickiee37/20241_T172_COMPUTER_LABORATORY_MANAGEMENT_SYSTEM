import React from 'react';

const LabCard = ({ labNumber, currentUser }) => {
  const hasUser = !!currentUser;

  return (
    <div className="lab-card">
      <h2>Comlab {labNumber}</h2>
      {hasUser ? (
        <>
          <h3>{currentUser.name}</h3>
          <p>Date: {currentUser.date}</p>
          <p>Time In: {currentUser.timeIn}</p>
        </>
      ) : (
        <p className="no-user">This lab is currently available.</p>
      )}
    </div>
  );
};

export default LabCard;
