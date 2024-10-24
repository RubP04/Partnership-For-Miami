// src/components/ForgotPassword.js
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false); // New state for email sent status

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would normally call an API to send the password reset email
    console.log('Password recovery email sent to:', email);

    // Simulate email sending and set the emailSent status to true
    setEmailSent(true);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Forgot Password</h2>
      
      {/* Show a message if email was sent */}
      {emailSent ? (
        <div>
          <p>A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.</p>
        </div>
      ) : (
        // Show the form if the email hasn't been sent yet
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Password Reset Link</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
