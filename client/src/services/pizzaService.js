import api from './api';

export const getPizzas = async () => {
  try {
    const { data } = await api.get('/pizzas');
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const createPizza = async (pizzaData) => {
  try {
    const { data } = await api.post('/pizzas', pizzaData);
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};
