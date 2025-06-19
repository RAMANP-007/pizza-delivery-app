import api from './api';

export const createOrder = async (orderData) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};
