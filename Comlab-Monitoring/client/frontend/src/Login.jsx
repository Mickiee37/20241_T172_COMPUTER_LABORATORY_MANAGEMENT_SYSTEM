import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios for making API calls
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate
  const [error, setError] = useState(''); // For storing error messages

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      // Send a POST request to your backend to check if the user exists
      const response = await axios.post('http://localhost:8000/api/users/check-user', { email, password });

      if (response.status === 200) {
        // If user exists and credentials are correct, navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
        <div className="login-image">
            <img src="BG2.png" alt="Building" />
      </div>
      <div className="login-form">
      <img src="COTLOGO.png" alt="Logo" className="login-logo" /> {/* Add logo here */}
        <h1>BUKSU</h1>
        <p className="com">Computer Laboratory Monitoring System</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
