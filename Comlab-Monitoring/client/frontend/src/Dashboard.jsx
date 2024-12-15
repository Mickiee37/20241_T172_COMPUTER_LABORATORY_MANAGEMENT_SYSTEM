import React, { useEffect, useState } from 'react';
import LabCard from './LabCard';
import './dashboard.css';
import { IoPersonSharp } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { MdHistory } from "react-icons/md";
import { FaQrcode } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    navigate('/');  // Redirect to the homepage or login page
  };

  // State for lab data, loading, and error handling
  const [labData, setLabData] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      labNumber: i + 1,
      currentUser: null,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the backend API
  const fetchGoogleSheetData = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await axios.get('http://192.168.100.4:8000/api/google-sheet-data');

      // Handle case where no data is returned
      if (!response.data || response.data.length === 0) {
        setError('No data found in Google Sheets.');
        setLoading(false);
        return; 
      }

      const sheetData = response.data;
      console.log('Fetched Sheet Data:', sheetData); // Debugging: Log the fetched data

      // Update labData with the fetched data
      setLabData(prevData =>
        prevData.map(lab => {
          const labUsage = sheetData.find(row => row.labNumber === lab.labNumber);
          return {
            ...lab,
            currentUser: labUsage
              ? {
                  name: labUsage.instructorName || 'Unknown',
                  date: labUsage.date || 'N/A',
                  timeIn: labUsage.timeIn || 'N/A',
                }
              : null,
          };
        })
      );
    } catch (error) {
      // Detailed error logging
      console.error('Error fetching Google Sheets data:', error.response || error.message);
      setError('Unable to fetch Google Sheets data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchGoogleSheetData(); // Fetch data once when the component mounts
  }, []);  // Empty dependency array ensures it runs only once

  return (
    <div className="dashboard">
      <nav className="navbar fixed-top navbar-expand-lg bg-black">
        <div className="container">
          <a className="navbar-brand text-white">Computer Laboratory Monitoring System</a>
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
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="lab-cards">
        {loading ? (
          <p>Loading lab data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          labData.map(lab => (
            <LabCard
              key={lab.labNumber}
              labNumber={lab.labNumber}
              currentUser={lab.currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
