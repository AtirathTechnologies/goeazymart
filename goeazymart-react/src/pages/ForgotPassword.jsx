import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Verify Email, 2: Reset Password
  const [userData, setUserData] = useState(null);
  const [userKey, setUserKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      let foundUser = null;
      let foundKey = null;

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        for (const key in usersData) {
          if (usersData[key] && usersData[key].email && usersData[key].email.toLowerCase() === email.toLowerCase()) {
            foundUser = usersData[key];
            foundKey = key;
            break;
          }
        }
      }

      if (foundUser && foundKey) {
        setUserData(foundUser);
        setUserKey(foundKey);
        setStep(2);
      } else {
        setError('Email address is not registered!');
      }
    } catch (err) {
      console.error('Verify email error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const userRef = ref(db, `users/${userKey}`);
      
      const updatedUser = {
        ...userData,
        password: newPassword
      };

      await set(userRef, updatedUser);
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h2>Reset <span className="gold">Password</span></h2>
          <p>Retrieve or update your Goeazy Mart account password.</p>
        </div>

        {error && (
          <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: '#155724',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerifyEmail}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn">Verify Email</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666',
                    opacity: showPassword ? 1 : 0.4,
                    outline: 'none',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  👁️
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666',
                    opacity: showConfirmPassword ? 1 : 0.4,
                    outline: 'none',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  👁️
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn">Reset Password</button>
          </form>
        )}

        <div className="auth-footer">
          <p>Back to <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
