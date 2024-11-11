import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({}); // To store specific validation error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Email validation regex for @buksu.edu.ph
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@buksu\.edu\.ph$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Display validation errors
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
        alert('Registration successful');
        navigate('/login'); 
      } else {
        setErrors({ api: data.message }); // Display backend error if any
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ api: 'Error registering user' });
    }
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className='register-button'>Register</button>
        {errors.api && <p className="error-message">{errors.api}</p>} {/* Display API error if backend returns one */}
      </form>

      <p className="login-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
    </div>

  );
};

export default Register;