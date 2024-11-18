import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Send the token to the backend to verify
      const response = await axios.post('http://localhost:8000/api/users/google-login', { token });

      if (response.status === 200) {
        navigate('/dashboard', { state: { message: 'Login successful!' } });
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      setError(error.message);
    }
  };

  // Email/Password Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    try {
      const response = await axios.post('http://localhost:8000/api/users/check-user', { email, password });

      if (response.status === 200) {
        navigate('/dashboard', { state: { message: 'Login successful!' } });
      }
    } catch (err) {
      const errorMessage = err.response?.status === 403
        ? 'Your account is not verified. Please check your email to verify your account.'
        : err.response?.data?.message || 'Login failed';
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="BG2.png" alt="Building" />
      </div>
      <div className="login-form">
        <img src="COTLOGO.png" alt="Logo" className="login-logo" />
        <h1>BUKSU</h1>
        <p className="com">Computer Laboratory Monitoring System</p>

        <button onClick={handleGoogleSignIn} className="google-login">
          <img src="google.png" alt="Google icon" className="google-icon" />Continue with Google
        </button>

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
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;