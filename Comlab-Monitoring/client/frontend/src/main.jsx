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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserType />} /> {/* Set UserType as the default route */}
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/qr-code" element={<QRCodeGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
