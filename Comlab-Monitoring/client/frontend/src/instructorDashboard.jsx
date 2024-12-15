import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabCard from "./LabCard";
import "./dashboard.css";
import axios from "axios";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const [labData, setLabData] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      labNumber: i + 1,
      currentUser: null,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://192.168.100.4:8000/api/google-sheet-data");
        const sheetData = response.data;

        setLabData((prevData) =>
          prevData.map((lab) => ({
            ...lab,
            currentUser: sheetData.find((row) => row.labNumber === lab.labNumber) || null,
          }))
        );
      } catch (error) {
        setError("Unable to fetch Google Sheets data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleSheetData();
  }, []);

  return (
    <div className="dashboard">
      {/* Simplified Navigation */}
      <nav className="navbar fixed-top navbar-expand-lg bg-black">
        <div className="container">
          <a className="navbar-brand text-white">Computer Laboratory Monitoring System</a>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Lab Cards */}
      <div className="lab-cards">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          labData.map((lab) => (
            <LabCard key={lab.labNumber} labNumber={lab.labNumber} currentUser={lab.currentUser} />
          ))
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
