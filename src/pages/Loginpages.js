import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpages.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Bersihkan error sebelumnya
    try {
      // Panggil API login di backend
      const response = await axios.post('/api/login', { email, password });
      
      // Simpan token yang didapat
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Atur axios agar selalu mengirim token ini di header
      axios.defaults.headers.common['x-auth-token'] = token;
      
      // Arahkan ke halaman utama (board)
      navigate('/');
      
    } catch (err) {
      setError('Email atau password salah');
      console.error(err);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        
        {/* --- KONTEN KIRI --- */}
        <div className="login-info-container">
          <div className="logo">TRAVEL</div>
          <h1>EXPLORE HORIZONS</h1>
          <h2>Where Your Dream Destinations Become Reality.</h2>
          <p>
            Embark on a journey where every corner
            of the world is within your reach.
          </p>
        </div>

        {/* --- KONTEN KANAN (FORM) --- */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Judul "Sign In" tidak ada di desain, jadi kita hilangkan */}
            {/* <h2>Sign In</h2> */}
            
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
                placeholder="**********"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            
            {error && <p style={{ color: '#ff9c9c', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className="sign-in-button">
              SIGN IN
            </button>
            
            <div className="separator">or</div>
            
            <button type="button" className="google-button">
              {/* URL Ikon Google, bisa diganti dengan file lokal jika mau */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google icon" />
              Sign in with Google
            </button>
            
            <div className="create-account">
              Are you new? <Link to="/signup">Create an Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;