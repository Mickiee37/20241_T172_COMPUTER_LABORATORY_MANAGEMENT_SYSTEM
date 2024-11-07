import React, { useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from "firebase/auth";
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
      const response = await axios.post('http://localhost:8000/api/user/check-user', { email, password });

      if (response.status === 200) {
        // If user exists and credentials are correct, navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User Info:', user);

      // Redirect to the Dashboard component after successful login
      navigate('/dashboard'); // Redirect to /dashboard instead of /app
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="path/to/your/image.png" alt="Building" />
      </div>
      <div className="login-form">
        <h1>BUKSU</h1>
        <p>Computer Laboratory Monitoring System</p>
        <button className="google-login" onClick={handleGoogleLogin}>Continue with Google</button>
        <hr />
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
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
