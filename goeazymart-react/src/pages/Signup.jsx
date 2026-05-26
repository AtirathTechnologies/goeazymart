import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase';
import '../styles/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      let nextUserIndex = 1;
      
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        
        // Check if user already exists
        const emailExists = Object.values(usersData).some(
          u => u && u.email && u.email.toLowerCase() === formData.email.toLowerCase()
        );
        
        if (emailExists) {
          alert('User already exists!');
          return;
        }
        
        // Find maximum existing user-X index
        const keys = Object.keys(usersData);
        let maxIndex = 0;
        keys.forEach(key => {
          if (key.startsWith('user-')) {
            const num = parseInt(key.split('-')[1]);
            if (!isNaN(num) && num > maxIndex) {
              maxIndex = num;
            }
          }
        });
        nextUserIndex = maxIndex + 1;
      }

      const newUserKey = `user-${nextUserIndex}`;
      const newUserRef = ref(db, `users/${newUserKey}`);

      // Store in users node in Firebase Realtime Database
      await set(newUserRef, {
        userKey: newUserKey,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      });

      alert('Account Created Successfully!');
      navigate('/login', { state: { from: location.state?.from } });
    } catch (error) {
      console.error("Signup error:", error);
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h2>Create <span className="gold">Account</span></h2>
          <p>Join Goeazy Mart for premium trade solutions.</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
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
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
