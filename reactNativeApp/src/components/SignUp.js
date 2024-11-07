// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css'; // Import the CSS file

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic for sign-up here (e.g., API call)
    console.log('Account created for:', { username, email });
    navigate('/category-selection');
  };

  return (
    <div className="signup-container"> {/* Apply container styling */}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form"> {/* Apply form styling */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Sign Up</button> {/* Apply universal button style */}
      </form>
      <div className="login-link">
        <p>Already have an account? <Link to="/login">Log In</Link></p> {/* Add link to login page */}
      </div>
    </div>
  );
};

export default SignUp;
