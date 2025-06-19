import api from './api';

export const getRazorpayKey = async () => {
  try {
    const { data } = await api.get('/payment/razorpay-key');
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const createRazorpayOrder = async (orderId) => {
  try {
    const { data } = await api.post('/payment/create-order', { orderId });
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const { data } = await api.post('/payment/verify-payment', paymentData);
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};
