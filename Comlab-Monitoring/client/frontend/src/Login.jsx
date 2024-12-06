import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase"; // Import auth and provider from firebase.js
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // Import axios for making API calls
import ReCAPTCHA from "react-google-recaptcha"; // Import the reCAPTCHA component
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState('');
  const navigate = useNavigate();

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info: ", user);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://192.168.100.4:8000'}/api/users/check-user`, {
        email,
        password,
        recaptchaValue
      });

      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP for Login
  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://192.168.100.4:8000'}/send-otp`,
        { phoneNumber }
      );
      if (response.data.success) {
        setIsOtpSent(true);
        setError('');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://192.168.100.4:8000'}/verify-otp`,
        { phoneNumber, otp }
      );
      if (response.data.success) {
        alert('OTP verified successfully!');
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsLoading(false);
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

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          className="google-login"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : (
            <>
              <img src="google.png" alt="Google icon" className="google-icon" />
              Continue with Google
            </>
          )}
        </button>

        {/* Email/Password Login */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="show-password">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <ReCAPTCHA
            sitekey="6Leo5IQqAAAAAFgqYPT72ORc-4tOpj3iJ_vdYGfM"
            onChange={setRecaptchaValue}
          />
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error Messages */}
        {error && <p className="error-message">{error}</p>}

        {/* Links */}
        <div className="login-links">
          <p className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
          <p className="reset-password-link">
            <a href="/reset-password">Reset your password here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
