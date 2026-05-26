import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Seed default admin if admins node is empty
      const adminsRef = ref(db, 'admins');
      let adminsSnapshot = await get(adminsRef);
      if (!adminsSnapshot.exists()) {
        await set(ref(db, 'admins/admin-1'), {
          name: 'System Admin',
          email: 'admin@goeazymart.com',
          password: 'admin123',
          phone: '9999999999',
          address: 'Goeazymart HQ, Tech Park'
        });
        adminsSnapshot = await get(adminsRef);
      }

      let foundUser = null;

      // 1. Scan admins node first
      if (adminsSnapshot.exists()) {
        const adminsData = adminsSnapshot.val();
        for (const key in adminsData) {
          if (adminsData[key] && adminsData[key].email && adminsData[key].email.toLowerCase() === email.toLowerCase()) {
            foundUser = {
              ...adminsData[key],
              userKey: key,
              isAdmin: true
            };
            break;
          }
        }
      }

      // 2. If not found in admins, check users node
      if (!foundUser) {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          for (const key in usersData) {
            if (usersData[key] && usersData[key].email && usersData[key].email.toLowerCase() === email.toLowerCase()) {
              foundUser = {
                ...usersData[key],
                userKey: key,
                isAdmin: false
              };
              break;
            }
          }
        }
      }

      if (foundUser) {
        if (foundUser.password === password) {
          alert('Login Successful!');
          localStorage.setItem('user', JSON.stringify(foundUser));
          if (foundUser.isAdmin) {
            navigate('/admin');
          } else {
            const redirectUrl = location.state?.from || '/';
            navigate(redirectUrl);
          }
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h2>Welcome <span className="gold">Back</span></h2>
          <p>Login to manage your orders and quotes.</p>
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

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="auth-actions">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" state={{ from: location.state?.from }}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
