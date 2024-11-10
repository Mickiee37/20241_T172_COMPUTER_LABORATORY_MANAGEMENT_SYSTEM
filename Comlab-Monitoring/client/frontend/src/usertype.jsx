import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './usertype.css';

const UserType = () => {
  const [selectedUserType, setSelectedUserType] = useState('');
  const navigate = useNavigate();

  const handleSelect = (type) => {
    setSelectedUserType(type);
    console.log(`User selected: ${type}`); // Debugging log
    if (type === 'Admin') {
      console.log("Redirecting to /Login"); // Debugging log
      navigate('/Login'); // Redirect to /Login when "Admin" is selected
    }
  };

  return (
    <div className="usertype-container">
      <h1>Select User Type</h1>
      <div className="user-options">
        <div
          className={`user-card ${selectedUserType === 'Admin' ? 'selected' : ''}`}
          onClick={() => handleSelect('Admin')}
        >
          <img src="adminpic.png" alt="Admin" className="user-icon" />
          <p>Admin</p>
        </div>
        <div
          className={`user-card ${selectedUserType === 'Instructor' ? 'selected' : ''}`}
          onClick={() => handleSelect('Instructor')}
        >
          <img src="inspic.png" alt="Instructor" className="user-icon" />
          <p>Instructor</p>
        </div>
      </div>
    </div>
  );
};

export default UserType;
