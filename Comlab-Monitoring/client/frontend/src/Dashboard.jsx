import React, { useEffect, useState } from 'react'; // Import React hooks
import LabCard from './LabCard';
import './dashboard.css';
import { IoPersonSharp } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { MdHistory } from "react-icons/md";
import { FaQrcode } from 'react-icons/fa'; // Import QR code icon from FontAwesome
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import axios from 'axios'; // Import axios for API calls
import moment from 'moment'; // Import moment for date formatting

const Dashboard = () => {
  const navigate = useNavigate(); // React Router's useNavigate for redirection

  const handleLogout = () => {
    // Redirect to the user type selection menu
    navigate('/');
  };

  // Initialize state for lab data
  const [labData, setLabData] = useState([
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
  ]);

  // Fetch active sessions from the backend
  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/attendance/active-sessions'); // API endpoint
        const activeSessions = response.data;

        // Map active session data to lab data
        setLabData(prevData =>
          prevData.map(lab => {
            const activeSession = activeSessions.find(session => session.labNumber === lab.labNumber);
            return {
              ...lab,
              currentUser: activeSession
                ? {
                    name: activeSession.instructorName,
                    timeIn: moment(activeSession.timeIn).format('YYYY-MM-DD HH:mm'),
                  }
                : null,
            };
          })
        );
      } catch (error) {
        console.error('Error fetching active sessions:', error);
      }
    };

    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className="dashboard">
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
            <Link to="/history" className="navbar-item">
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

      {/* Lab Cards */}
      <div className="lab-cards">
        {labData.map(lab => (
          <LabCard
            key={lab.labNumber}
            labNumber={lab.labNumber}
            currentUser={lab.currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
