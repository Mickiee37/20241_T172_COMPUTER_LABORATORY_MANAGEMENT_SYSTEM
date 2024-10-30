// src/RegisterForm.js
import React from 'react';
import './AuthForm.css';

function RegisterForm({toggleForm}) {
  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="/BG2.png" alt="BUKSU Building" />
      </div>
      <div className="auth-form">
        <h1 className="auth-title">B U K S U</h1>
        <h2>Computer Laboratory Monitoring System</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit" className="submit-btn">Register</button>
        </form>
        <p className="switch-auth">Already Have an Account? <a onClick={toggleForm} style={{ cursor: 'pointer', color: 'blue',}}>Login</a></p>
      </div>
    </div>
  );
}

export default RegisterForm;
