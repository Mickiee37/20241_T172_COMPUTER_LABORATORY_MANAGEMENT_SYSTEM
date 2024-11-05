import React, { useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
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
