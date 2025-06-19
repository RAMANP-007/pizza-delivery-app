import React, { useState, useMemo, useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import './BuildPizza.css';

const toppingsData = [
  { id: 'pepperoni', name: 'Pepperoni', price: 1.5, image: '/images/toppings/pepperoni.png' },
  { id: 'mushrooms', name: 'Mushrooms', price: 1.0, image: '/images/toppings/mushrooms.png' },
  { id: 'onions', name: 'Onions', price: 0.75, image: '/images/toppings/onions.png' },
  { id: 'olives', name: 'Olives', price: 1.0, image: '/images/toppings/olives.png' },
  { id: 'peppers', name: 'Peppers', price: 1.0, image: '/images/toppings/peppers.png' },
  { id: 'basil', name: 'Basil', price: 1.25, image: '/images/toppings/basil.png' },
];

const basePrices = { size: { Small: 8, Medium: 10, Large: 12 }, crust: { Classic: 0, Thin: 0, Stuffed: 2 } };

const BuildPizza = () => {
  const { dispatch } = useContext(CartContext);

  const [size, setSize] = useState('Medium');
  const [crust, setCrust] = useState('Classic');
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleToppingToggle = (topping) => {
    setSelectedToppings((prev) =>
      prev.find(t => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const totalPrice = useMemo(() => {
    const sizePrice = basePrices.size[size];
    const crustPrice = basePrices.crust[crust];
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return sizePrice + crustPrice + toppingsPrice;
  }, [size, crust, selectedToppings]);

  const toppingVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="build-pizza-page">
      <div className="container">
        <h1>Build Your Masterpiece</h1>
        <div className="builder-layout">
          <div className="pizza-visualizer">
            <motion.img src="Images\pizza-base.jpg" alt="Pizza Base" className="pizza-base" layout />
            <AnimatePresence>
              {selectedToppings.map((topping) => (
                <motion.img
                  key={topping.id}
                  src={topping.image}
                  alt={topping.name}
                  className={`topping-img ${topping.id}`}
                  variants={toppingVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                />
              ))}
            </AnimatePresence>
          </div>
          <div className="options-panel">
            <div className="option-section">
              <h2>1. Choose Size</h2>
              <div className="toggle-group">
                {Object.keys(basePrices.size).map(s => (
                  <button key={s} className={`toggle-btn ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="option-section">
              <h2>2. Select Crust</h2>
              <div className="toggle-group">
                {Object.keys(basePrices.crust).map(c => (
                  <button key={c} className={`toggle-btn ${crust === c ? 'active' : ''}`} onClick={() => setCrust(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="option-section">
              <h2>3. Add Toppings</h2>
              <div className="toppings-grid">
                {toppingsData.map(topping => (
                  <motion.div
                    key={topping.id}
                    className={`topping-card ${selectedToppings.find(t => t.id === topping.id) ? 'selected' : ''}`}
                    onClick={() => handleToppingToggle(topping)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={topping.image} alt={topping.name} />
                    <p>{topping.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="summary-section">
              <h2>Total: ${totalPrice.toFixed(2)}</h2>
              <button 
                className="btn-add-to-cart"
                onClick={() => {
                  const customPizza = {
                    _id: `custom-${Date.now()}`,
                    name: `Custom Pizza (${size}, ${crust})`,
                    image: '/images/custom-pizza.png', // A generic image for custom pizzas
                    variant: 'Custom',
                    price: totalPrice,
                    quantity: 1,
                    description: `A custom pizza with ${selectedToppings.map(t => t.name).join(', ')}.`
                  };
                  dispatch({ type: 'ADD_TO_CART', payload: customPizza });
                  alert('Your custom pizza has been added to the cart!');
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPizza;
