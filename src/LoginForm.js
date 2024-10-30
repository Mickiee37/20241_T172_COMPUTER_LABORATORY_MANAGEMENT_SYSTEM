// src/LoginForm.js
import React from 'react';
import './AuthForm.css';

function LoginForm({toggleForm}) {
  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="/BG2.png" alt="BUKSU Building" />
      </div>
      <div className="auth-form">
        <h1 className="auth-title">B U K S U</h1>
        <h2>Computer Laboratory Monitoring System</h2>
        <button className="google-btn">Continue with Google</button>
        <div className="divider">OR</div>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <div className="remember-me">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="switch-auth">Don't Have an Account? <a onClick={toggleForm} style={{ cursor: 'pointer', color: 'blue',}}>Register</a></p>
      </div>
    </div>
  );
}

export default LoginForm;
