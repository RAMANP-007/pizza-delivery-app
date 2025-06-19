import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { login } from '../services/authService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      dispatch({ type: 'USER_LOGIN', payload: data });
      navigate('/'); // Redirect to home page on successful login
    } catch (error) {
      console.error(error);
      alert('Failed to login');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <motion.div
          className="login-form-section"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="form-content">
            <h1>Welcome Back!</h1>
            <p>Log in to continue your pizza journey.</p>
            <form className="login-form" onSubmit={submitHandler}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-login">Log In</button>
            </form>
            <div className="signup-prompt">
              <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
          </div>
        </motion.div>
        <div className="login-image-section">
          {/* This div will be styled with a background image in CSS */}
        </div>
      </div>
    </div>
  );
};

export default Login;
