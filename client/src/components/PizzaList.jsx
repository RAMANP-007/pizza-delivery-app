import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PizzaList = ({ onEdit }) => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/pizzas');
      setPizzas(data);
    } catch (err) {
      setError('Failed to fetch pizzas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleDelete = async (pizzaId) => {
    if (window.confirm('Are you sure you want to delete this pizza?')) {
      try {
        await api.delete(`/admin/pizza/${pizzaId}`);
        setPizzas(pizzas.filter((p) => p._id !== pizzaId));
        alert('Pizza deleted successfully!');
      } catch (err) {
        setError('Failed to delete pizza.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading-indicator">Loading Pizzas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="pizza-list">
      {pizzas.map((pizza) => (
        <div key={pizza._id} className="pizza-item">
          <img src={`http://localhost:5000/${pizza.image.replace(/\\/g, '/')}`} alt={pizza.name} />
          <div className="pizza-item-content">
            <h3>{pizza.name}</h3>
            <p className="price">${pizza.price}</p>
            <p>{pizza.description}</p>
            <div className="pizza-item-actions">
              <button onClick={() => onEdit(pizza)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(pizza._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PizzaList;
