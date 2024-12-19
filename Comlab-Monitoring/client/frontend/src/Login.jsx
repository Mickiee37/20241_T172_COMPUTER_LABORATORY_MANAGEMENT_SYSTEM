import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase"; // Import auth and provider from firebase.js
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // Import axios for making API calls
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(''); // For storing error messages

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info: ", user);
      navigate('/dashboard/qr-code'); // Navigate to QR Code page after successful login
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      setError(error.message); // Display error message if Google Sign-In fails
    }
  };

  // Email/Password Login Handler
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    console.log('Email:', email);
    console.log('Password:', password);

    try {
      // Send a POST request to check if the user exists in your backend
      const response = await axios.post('http://localhost:8000/api/users/check-user', { email, password });

      if (response.status === 200) {
        // If user exists and credentials are correct, navigate to QR Code page
        navigate('/dashboard/qr-code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed'); // Show error if login fails
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

        {/* Google Sign-In Button */}
        <button onClick={handleGoogleSignIn} className="google-login">
          <img src="google.png" alt="Google icon" className="google-icon" />Continue with Google
        </button>

        <hr />

        {/* Email/Password Login Form */}
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
