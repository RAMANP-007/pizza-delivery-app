import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const textVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>Our Story</h1>
        </div>
      </section>
      <section className="about-content-section">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-text"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2>Welcome to PizzaLelo</h2>
              <p>Founded in 2023, PizzaLelo was born from a simple passion: to create the most authentic and delicious pizza possible. We believe that great pizza starts with the freshest ingredients, a commitment to quality, and a love for community.</p>
              <p>Our mission is to bring joy to our customers, one slice at a time. Every pizza we craft is a work of art, prepared with care by our dedicated team of pizzaiolos who pour their hearts into every detail.</p>
            </motion.div>
            <motion.div
              className="about-image"
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src="\Images\about-us.png" alt="Our Pizzeria" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
