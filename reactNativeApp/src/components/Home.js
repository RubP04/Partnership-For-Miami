// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Make sure to adjust the path if needed

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Our App</h1>
      {/* Apply the .button class */}
      <button onClick={() => navigate('/login')} className="button">
        Go to Login
      </button>
      <button onClick={() => navigate('/signup')} className="button">
        Go to Sign Up
      </button>
    </div>
  );
};

export default Home;
