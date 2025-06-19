import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PizzaForm = ({ pizzaToEdit, onFormSubmit, onCancel }) => {
  const initialState = {
    name: '',
    description: '',
    price: '',
    base: 'Thin Crust',
    sauce: 'Tomato',
    cheese: 'Mozzarella',
    veggies: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bases = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
  const sauces = ['Tomato', 'Pesto', 'White Garlic'];
  const cheeses = ['Mozzarella', 'Cheddar', 'Parmesan', 'Vegan'];
  const allVeggies = ['Onion', 'Capsicum', 'Mushroom', 'Olives', 'Corn', 'Tomato'];

  useEffect(() => {
    if (pizzaToEdit) {
      setFormData({
        name: pizzaToEdit.name || '',
        description: pizzaToEdit.description || '',
        price: pizzaToEdit.price || '',
        base: pizzaToEdit.base || 'Thin Crust',
        sauce: pizzaToEdit.sauce || 'Tomato',
        cheese: pizzaToEdit.cheese || 'Mozzarella',
        veggies: pizzaToEdit.veggies || [],
      });
    } else {
      setFormData(initialState);
    }
  }, [pizzaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVeggiesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({ ...prev, veggies: [...prev.veggies, value] }));
    } else {
      setFormData((prev) => ({ ...prev, veggies: prev.veggies.filter((v) => v !== value) }));
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = pizzaToEdit ? pizzaToEdit.image : '';

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const { data: uploadData } = await api.post('/upload', uploadFormData);
        imageUrl = uploadData.image;
      }

      const pizzaPayload = { ...formData, image: imageUrl };
      
      if (pizzaToEdit) {
        // Update pizza
        await api.put(`/admin/pizza/${pizzaToEdit._id}`, pizzaPayload);
      } else {
        // Add new pizza
        await api.post('/admin/add-pizza', pizzaPayload);
      }

      onFormSubmit();
    } catch (error) {
      console.error('Error submitting pizza form:', error);
      alert('Failed to save pizza. Please check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{pizzaToEdit ? 'Edit Pizza' : 'Add New Pizza'}</h2>
        <form onSubmit={handleSubmit} className="pizza-form">
          {/* Form groups for name, description, price */}
          <div className="form-group">
            <label>Pizza Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group form-group-full">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          {/* Selects for base, sauce, cheese */}
          <div className="form-group">
            <label>Base</label>
            <select name="base" value={formData.base} onChange={handleChange}>
              {bases.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Sauce</label>
            <select name="sauce" value={formData.sauce} onChange={handleChange}>
              {sauces.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Cheese</label>
            <select name="cheese" value={formData.cheese} onChange={handleChange}>
              {cheeses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Checkboxes for veggies */}
          <div className="form-group form-group-full">
            <label>Veggies</label>
            <div className="checkbox-group">
              {allVeggies.map(veg => (
                <div key={veg} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={veg}
                    value={veg}
                    checked={formData.veggies.includes(veg)}
                    onChange={handleVeggiesChange}
                  />
                  <label htmlFor={veg}>{veg}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Image Upload */}
          <div className="form-group form-group-full">
            <label>Image</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Pizza'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PizzaForm;
