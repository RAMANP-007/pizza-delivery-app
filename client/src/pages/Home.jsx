import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import './Home.css';

const Home = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch('/api/pizzas');
        const data = await response.json();
        setPizzas(data);
      } catch (error) {
        console.error('Error fetching pizzas:', error);
      }
    };

    fetchPizzas();
  }, []);

  const featuredPizzas = pizzas.filter(p => p.variants && p.variants.length > 0).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="home">
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1>Best Pizza in Town</h1>
            <p>Deliciously handcrafted pizzas delivered to your door.</p>
            <Link to="/menu" className="btn-primary">Order Now</Link>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img src="/Images/Delicious_Pizza_white_background___Premium_AI-generated_image-removebg-preview.png" alt="Delicious Pizza" />
          </motion.div>
        </div>
      </section>

      <section className="featured-menu">
        <div className="container">
          <h2 className="section-title">Featured Menu</h2>
          <motion.div
            className="pizza-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredPizzas.map((pizza) => (
              <motion.div key={pizza._id} className="pizza-card" variants={itemVariants}>
                <img src={`http://localhost:5000/${pizza.image.replace(/\\/g, '/')}`} alt={pizza.name} />
                <h3>{pizza.name}</h3>
                <p>{pizza.description}</p>
                <span>${pizza.variants[0].price}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="about-preview">
        <div className="container">
          <motion.div
            className="about-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="section-title">About Us</h2>
            <p>We are passionate about making the best pizza with the freshest ingredients. Our mission is to bring joy to our customers, one slice at a time.</p>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </motion.div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="container">
          <motion.div
            className="home-cta-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2>Ready to Create Your Masterpiece?</h2>
            <p>You've seen what we're about, now it's time to create your own. Head over to our pizza builder and craft the pizza of your dreams!</p>
            <Link to="/build-pizza" className="btn-cta-home">Build Your Dream Pizza</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
