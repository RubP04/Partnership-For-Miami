// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Our App</h1>
      <button onClick={() => navigate('/login')} style={{ margin: '10px', padding: '10px 20px' }}>
        Go to Login
      </button>
      <button onClick={() => navigate('/signup')} style={{ margin: '10px', padding: '10px 20px' }}>
        Go to Sign Up
      </button>
    </div>
  );
};

export default Home;
