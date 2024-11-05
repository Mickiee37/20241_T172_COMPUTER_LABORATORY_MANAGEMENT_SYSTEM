// PersonIcon.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaUser } from 'react-icons/fa'; // Import the user icon from react-icons

const PersonIcon = () => {
  return (
    <Link to="/app" className="icon-link">
      <FaUser size={30} /> {/* Adjust size as needed */}
    </Link>
  );
};

export default PersonIcon;
