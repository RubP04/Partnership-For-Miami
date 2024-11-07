// src/components/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Make sure to apply your existing styles

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img src="../logo.svg" alt="Partnership For Miami" className="logo" />
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Oops!</h2>
      <p className="error-description">The page you are looking for cannot be found</p>
      <button onClick={() => navigate('/')} className="button">
        Return Home
      </button>
    </div>
  );
};

export default NotFound;
