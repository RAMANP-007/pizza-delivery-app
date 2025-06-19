import api from './api';

export const uploadImage = async (formData) => {
  try {
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};
