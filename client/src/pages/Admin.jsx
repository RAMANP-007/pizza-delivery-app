import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PizzaForm from '../components/PizzaForm';
import PizzaList from '../components/PizzaList';
import './AdminPanel.css';

const Admin = () => {
  const navigate = useNavigate();
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
    navigate('/menu'); // Redirect to menu to see the new pizza
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
