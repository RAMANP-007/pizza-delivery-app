import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Reach out with any questions or feedback.</p>
        </div>
      </div>
      <div className="container contact-content">
        <motion.div
          className="contact-layout"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="contact-form-container" variants={itemVariants}>
            <h2>Send Us a Message</h2>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="6" required></textarea>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </motion.div>
          <motion.div className="contact-info-container" variants={itemVariants}>
            <h2>Contact Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <FaMapMarkerAlt className="info-card-icon" />
                <h3>Our Address</h3>
                <p>123 Pizza Street, Flavor Town, USA</p>
              </div>
              <div className="info-card">
                <FaPhone className="info-card-icon" />
                <h3>Phone Number</h3>
                <p>(123) 456-7890</p>
              </div>
              <div className="info-card">
                <FaEnvelope className="info-card-icon" />
                <h3>Email Address</h3>
                <p>contact@pizzadelight.com</p>
              </div>
            </div>
            <div className="map-container">
              <img 
                src="/Images/map-placeholder.png" 
                alt="Our Location" 
                style={{ width: '100%', height: '250px', border: 0, objectFit: 'cover' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
