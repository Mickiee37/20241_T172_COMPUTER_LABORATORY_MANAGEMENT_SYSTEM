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
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const [error, setError] = useState(''); // For storing error messages
  const [recaptchaValue, setRecaptchaValue] = useState(''); // For storing reCAPTCHA token

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info: ", user);
      navigate('/dashboard'); // Navigate to the dashboard after successful login
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
      setError("Google Sign-In failed. Please try again."); // Display a user-friendly error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // reCAPTCHA Change Handler
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value); // Update recaptcha value when user solves the puzzle
  };

  // Email/Password Login Handler
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      console.log({ email, password, recaptchaValue });  // Debugging info
      const response = await axios.post('http://localhost:8000/api/users/check-user', { 
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
      setIsLoading(false); // End loading
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
        <button 
          onClick={handleGoogleSignIn} 
          className="google-login" 
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? "Loading..." : (
            <>
              <img src="google.png" alt="Google icon" className="google-icon" />
              Continue with Google
            </>
          )}
        </button>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
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

          {error && <p className="error-message">{error}</p>} {/* Display error message */}

          {/* reCAPTCHA widget */}
          <ReCAPTCHA
            sitekey="6Leo5IQqAAAAAFgqYPT72ORc-4tOpj3iJ_vdYGfM" // Use the actual reCAPTCHA site key here
            onChange={handleRecaptchaChange}
          />

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading} // Disable while loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
