import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase function
import { auth } from '../firebase'; // Import the initialized auth object
import '../styles.css'; // Import shared styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address. Please check your input.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      
      {emailSent ? (
        <div className="email-sent-message">
          <p>
            A password reset link has been sent to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions to reset your password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label>Email:</label>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;