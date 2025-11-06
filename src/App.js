import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Board from './Board';
import LoginPage from './pages/Loginpages';
import SignUpPage from './pages/SignUpPage';
import './App.css';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

function PrivateRoute({ children }) {
  const hasToken = localStorage.getItem('token');
  return hasToken ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Board />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;