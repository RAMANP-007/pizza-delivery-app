import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

import './Cart.css';

const Cart = () => {
  const { cart, dispatch } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const shipping = cart.items.length > 0 ? 5.0 : 0;
  const total = cart.totalPrice + shipping;

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.length === 0 ? (
              <p className="empty-cart-message">Your cart is empty.</p>
            ) : (
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item._id}
                    className="cart-item"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                    <div className="item-quantity">
                      <input type="number" value={item.quantity} readOnly />
                    </div>
                    <div className="item-total">
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="btn-checkout" onClick={checkoutHandler}>Proceed to Checkout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
