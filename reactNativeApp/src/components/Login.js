// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase function
import { auth } from '../firebase'; // Import the initialized auth object
import '../styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in user with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in with:', { email });
      navigate('/category-selection');
    } catch (error) {
      setError(error.message); // Handle errors
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>} {/* Display errors */}
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="button">Login</button>
      </form>
      <div className="forgot-password">
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
    </div>
  );
};

export default Login;
