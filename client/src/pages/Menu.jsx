import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { getPizzas } from '../services/pizzaService';
import { CartContext } from '../context/CartContext.jsx';
import './Menu.css';

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dispatch } = useContext(CartContext);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await getPizzas();
        setPizzas(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const handleAddToCart = (pizza) => {
    // For simplicity, add the first variant to the cart with quantity 1
    const cartItem = {
      _id: pizza._id, // Use a unique ID for the cart item
      name: pizza.name,
      image: pizza.image,
      variant: pizza.variants[0].name,
      price: pizza.variants[0].price,
      quantity: 1,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    alert(`${pizza.name} added to cart!`);
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

    if (loading) return <div className="menu-page"><div className="container"><p>Loading menu...</p></div></div>;
  if (error) return <div className="menu-page"><div className="container"><p>Error: {error}</p></div></div>;

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <div className="container">
          <h1>Our Delicious Menu</h1>
        </div>
      </section>
      <section className="menu-items-section">
        <div className="container">
          <motion.div
            className="menu-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {pizzas.map((pizza) => (
              <motion.div key={pizza._id} className="menu-item-card" variants={itemVariants}>
                <img src={pizza.image} alt={pizza.name} />
                <div className="item-details">
                  <h3>{pizza.name}</h3>
                  <p>{pizza.description}</p>
                  <div className="price-add-row">
                    <span className="price">${pizza.variants[0].price}</span>
                    <button className="btn-add-cart" onClick={() => handleAddToCart(pizza)}>Add to Cart</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
