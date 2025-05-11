import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/user');
  return response.data;
};

export const updateProfileImage = async (imageUrl) => {
  const response = await api.patch('/auth/profile-image', { profile_image_url: imageUrl });
  return response.data;
};