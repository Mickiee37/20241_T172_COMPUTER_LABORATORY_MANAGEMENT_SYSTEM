// Main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App.jsx';
import Login from './Login.jsx'; // Import your Login component
import Dashboard from './Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/app" element={<App />} />  {/* Ensure this matches the PersonIcon route */}
      </Routes>
    </Router>
  </StrictMode>
);
