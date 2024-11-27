import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Ensure styles are applied

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img src="../legal loop.png" alt="Partnership For Miami" className="logo" />
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Oops!</h2>
      <p className="error-description">
        The page you are looking for cannot be found. It might have been moved or no longer exists.
      </p>
      <button onClick={() => navigate('/')} className="button">
        Return Home
      </button>
    </div>
  );
};

export default NotFound;
