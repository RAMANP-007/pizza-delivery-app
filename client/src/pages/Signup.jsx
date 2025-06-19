import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { signup } from '../services/authService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(name, email, password);
      dispatch({ type: 'USER_LOGIN', payload: data });
      navigate('/'); // Redirect to home page on successful signup
    } catch (error) {
      console.error(error);
      alert('Failed to sign up');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-image-section">
          {/* This div will be styled with a background image in CSS */}
        </div>
        <motion.div
          className="signup-form-section"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="form-content">
            <h1>Create Your Account</h1>
            <p>Join us to order your favorite pizza in seconds!</p>
            <form className="signup-form" onSubmit={submitHandler}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-signup">Create Account</button>
            </form>
            <div className="login-prompt">
              <p>Already have an account? <Link to="/login">Log In</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
