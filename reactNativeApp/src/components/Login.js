import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/legislative-entries');
    } catch (error) {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address. Please check your input.');
          break;
        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .login-container {
            width: 100%;
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            background-color: #ffffff;
          }

          .login-container h2 {
            text-align: center;
            margin-bottom: 20px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
          }

          .form-group {
            margin-bottom: 15px;
            position: relative;
          }

          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }

          .input-field {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
          }

          .input-field:focus {
            border-color: #007bff;
            outline: none;
          }

          .email-container {
            display: flex;
            align-items: center;
            position: relative;
          }

          .email-input {
            width: 100%;
            padding-right: 40px;
          }

          .password-container {
            display: flex;
            align-items: center;
            position: relative;
          }

          .password-input {
            width: 100%;
            padding-right: 40px;
          }

          .toggle-password {
            position: absolute;
            right: 10px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #555;
          }

          .toggle-password:hover {
            color: #000;
          }

          .button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }

          .button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .error {
            color: red;
            margin-bottom: 15px;
            text-align: center;
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .forgot-password {
            text-align: center;
            margin-top: 15px;
          }

          .forgot-password a {
            color: #007bff;
            text-decoration: none;
          }

          .forgot-password a:hover {
            text-decoration: underline;
          }
        `}
      </style>

      {/* Login Form */}
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <div className="email-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field email-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field password-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
