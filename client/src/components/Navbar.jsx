import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { userInfo, dispatch: authDispatch } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    authDispatch({ type: 'USER_LOGOUT' });
    navigate('/login');
  };


  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navVariants = {
    hidden: { y: -100 },
    visible: { y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.nav
      className={`header ${scrolled ? 'scrolled' : ''}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        <div className="logo">
          <NavLink to="/">PizzaLelo</NavLink>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/menu">Menu</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/build-pizza">Build Pizza</NavLink></li>
          {userInfo && userInfo.isAdmin && (
            <li><NavLink to="/admin">Admin</NavLink></li>
          )}
        </ul>
        <div className="nav-actions">
          {userInfo ? (
            <>
              <span className="user-name">Hi, {userInfo.name}</span>
              <button onClick={handleLogout} className="btn-nav-outline">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-nav-outline">Login</NavLink>
              <NavLink to="/signup" className="btn-nav">Sign Up</NavLink>
            </>
          )}

          <NavLink to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cart.totalItems > 0 && <span className="cart-badge">{cart.totalItems}</span>}
            
          </NavLink>
          <div className="mobile-menu-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="mobile-nav-links"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ul>
            <li><NavLink to="/" end onClick={toggleMenu}>Home</NavLink></li>
            <li><NavLink to="/menu" onClick={toggleMenu}>Menu</NavLink></li>
            <li><NavLink to="/about" onClick={toggleMenu}>About</NavLink></li>
            <li><NavLink to="/contact" onClick={toggleMenu}>Contact</NavLink></li>
            <li><NavLink to="/build-pizza" onClick={toggleMenu}>Build Pizza</NavLink></li>
            {userInfo && userInfo.isAdmin && (
              <li><NavLink to="/admin" onClick={toggleMenu}>Admin</NavLink></li>
            )}
            <li className="mobile-auth-links">
              {userInfo ? (
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="btn-nav-outline">Logout</button>
              ) : (
                <>
                  <NavLink to="/login" className="btn-nav-outline" onClick={toggleMenu}>Login</NavLink>
                  <NavLink to="/signup" className="btn-nav" onClick={toggleMenu}>Sign Up</NavLink>
                </>
              )}
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
