import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import "bootstrap/dist/css/bootstrap.min.css";
import UserType from './usertype'; // Import UserType component
import Login from './Login.jsx';
import Register from './Register';
import Dashboard from './Dashboard.jsx';
import App from './App.jsx';
import QRCodeGenerator from './QRCodeGenerator';
import VerifyEmail from './VerifyEmail';
import ReCAPTCHA from 'react-google-recaptcha';
import QRScanner from './QRScanner.jsx';
import ResetPassword from "./ResetPassword";
import InstructorDashboard from "./instructorDashboard.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserType />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/qr-code" element={<QRCodeGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<App />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/generate-qr" element={<QRCodeGenerator />} />
        <Route path="/scan-qr" element={<QRScanner />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
      </Routes>
    </Router>
  </StrictMode>
);
