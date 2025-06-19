import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { createPizza } from '../services/pizzaService';

const PizzaForm = ({ pizzaToEdit, onFormSubmit, onCancel }) => {
  const getInitialState = () => ({
    name: '',
    description: '',
    category: 'Classic',
    variants: [{ name: 'Regular', price: '' }],
  });

  const [formData, setFormData] = useState(getInitialState());
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Classic', 'Specialty', 'Vegetarian', 'Vegan'];

  useEffect(() => {
    if (pizzaToEdit) {
      setFormData({
        name: pizzaToEdit.name || '',
        description: pizzaToEdit.description || '',
        category: pizzaToEdit.category || 'Classic',
        variants: pizzaToEdit.variants && pizzaToEdit.variants.length > 0 ? pizzaToEdit.variants : [{ name: 'Regular', price: '' }],
      });
    } else {
      setFormData(getInitialState());
    }
  }, [pizzaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', price: '' }],
    }));
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.variants.some(v => !v.name || !v.price)) {
      alert('Please fill out all variant names and prices.');
      return;
    }
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
        // NOTE: Update endpoint might need to be created/verified on the backend
        await api.put(`/api/pizzas/${pizzaToEdit._id}`, pizzaPayload);
      } else {
        await createPizza(pizzaPayload);
      }

      onFormSubmit();
    } catch (error) {
      console.error('Error submitting pizza form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save pizza. Please check console for details.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{pizzaToEdit ? 'Edit Pizza' : 'Add New Pizza'}</h2>
        <form onSubmit={handleSubmit} className="pizza-form">
          {/* General Info */}
          <div className="form-group">
            <label>Pizza Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group form-group-full">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          {/* Variants Section */}
          <div className="form-group form-group-full">
            <label>Sizes & Prices</label>
            {formData.variants.map((variant, index) => (
              <div key={index} className="variant-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Size Name (e.g., Regular)"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
                {formData.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="btn-remove-variant">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVariant} className="btn-add-variant">Add Size</button>
          </div>

          {/* Image Upload */}
          <div className="form-group form-group-full">
            <label>Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
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
