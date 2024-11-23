import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@student\.buksu\.edu\.ph$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*-_])/;
    return pattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    const newErrors = {};

    // Validate email
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address ending with @buksu.edu.ph';
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match!";
    }

    // Validate password length and complexity
    if (formData.password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters long';
    }

    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one number, and one special character.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false); // Reset loading
      return;
    }

    // Reset errors if form is valid
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Please check your email to verify your account.');

        // Generate the verification link (frontend route)
        const verificationLink = `http://localhost:3000/verify-email?token=${data.token}`;
        console.log('Verification link:', verificationLink);

        // Redirect to login page after successful registration
        navigate('/login');
      } else {
        setErrors({ api: data.message });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ api: 'Error registering user. Please try again later.' });
    } finally {
      setLoading(false); // Reset loading
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="register-container">
      <div className="register-image">
        <img src="BG2.png" alt="Building" />
      </div>
      <div className="register-form">
        <img src="COTLOGO.png" alt="Logo" className="register-logo" />
        <h1>BUKSU</h1>
        <p className="com">Computer Laboratory Monitoring System</p>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <div className="show-password">
              <input 
                type="checkbox" 
                id="showPassword" 
                checked={passwordVisible} 
                onChange={togglePasswordVisibility} 
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <div className="show-password">
              <input 
                type="checkbox" 
                id="showConfirmPassword" 
                checked={confirmPasswordVisible} 
                onChange={toggleConfirmPasswordVisibility} 
              />
              <label htmlFor="showConfirmPassword">Show Confirm Password</label>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {message && <p className="success-message">{message}</p>}
          {errors.api && <p className="error-message">{errors.api}</p>}
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
