import api from './api';

export const login = async (email, password) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    if (data) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const signup = async (name, email, password) => {
  try {
    const { data } = await api.post('/auth', { name, email, password });
    if (data) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};
