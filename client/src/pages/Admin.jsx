import React, { useState } from 'react';
import PizzaForm from '../components/PizzaForm';
import PizzaList from '../components/PizzaList';
import './AdminPanel.css';

const Admin = () => {
  const [view, setView] = useState('manage');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pizzaToEdit, setPizzaToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add a key to force re-render

  const handleShowForm = (pizza = null) => {
    setPizzaToEdit(pizza);
    setIsFormVisible(true);
  };

  const handleHideForm = () => {
    setIsFormVisible(false);
    setPizzaToEdit(null);
  };

  const handleFormSubmit = () => {
    handleHideForm();
    alert('Pizza saved successfully!');
    setRefreshKey(prevKey => prevKey + 1); // Trigger a refresh of the list
    setView('manage');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button onClick={() => handleShowForm()}>Add Pizza</button>
          <button onClick={() => setView('manage')}>Manage Pizzas</button>
        </div>
      </div>

      {isFormVisible && (
        <PizzaForm
          pizzaToEdit={pizzaToEdit}
          onFormSubmit={handleFormSubmit}
          onCancel={handleHideForm}
        />
      )}

      {view === 'manage' && <PizzaList key={refreshKey} onEdit={handleShowForm} />}
    </div>
  );
};

export default Admin;
