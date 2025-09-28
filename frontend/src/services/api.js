import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const createUser = async (userData) => {
  const response = await api.post('/users/', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserRecipes = async (userId) => {
  const response = await api.get(`/users/${userId}/recipes`);
  return response.data;
};

export const getUserEvents = async (userId) => {
  const response = await api.get(`/users/${userId}/events`);
  return response.data;
};

// Recipes API
export const createRecipe = async (recipeData) => {
  const response = await api.post('/recipes/', recipeData);
  return response.data;
};

export const getRecipe = async (recipeId) => {
  const response = await api.get(`/recipes/${recipeId}`);
  return response.data;
};

// Events API
export const createEvent = async (eventData) => {
  const response = await api.post('/events/', eventData);
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get('/events/');
  return response.data;
};

export const getEvent = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const joinEvent = async (joinData) => {
  const response = await api.post('/events/join/', joinData);
  return response.data;
};

export default api;
