// File: /frontend/src/pages/SignUpPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpages.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    try {
      const response = await axios.post('/api/signup', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      navigate('/');
    } catch (err) {
      setError('Email sudah terdaftar atau server error');
      console.error(err);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        <div className="login-info-container">
          <div className="logo">TRAVEL</div>
          <h1>CREATE ACCOUNT</h1>
          <h2>Join Us and Explore Your Horizons Today.</h2>
          <p>Sign up to start managing your journeys and discover new destinations.</p>
        </div>
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                placeholder="Create a password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <p style={{ color: '#ff9c9c', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
            <button type="submit" className="sign-in-button">CREATE ACCOUNT</button>
            <div className="separator">or</div>
            <button type="button" className="google-button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google icon" />
              Sign up with Google
            </button>
            <div className="create-account">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;