// src/components/ForgotPassword.js
import React, { useState } from 'react';
import '../styles.css'; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password recovery email sent to:', email);
    setEmailSent(true);
  };

  return (
    <div className="forgot-password-container"> {/* Apply container styling */}
      <h2>Forgot Password</h2>
      
      {emailSent ? (
        <div className="email-sent-message">
          <p>A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="forgot-password-form"> {/* Apply form styling */}
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
          <button type="submit" className="button">Send Password Reset Link</button> {/* Apply universal button style */}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
