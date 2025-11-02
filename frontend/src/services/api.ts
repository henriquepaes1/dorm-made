import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dorm-made-production.up.railway.app/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  university?: string | null;
  description?: string | null;
  profile_picture?: string | null;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  university: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export interface RecipeCreate {
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Event {
  id: string;
  host_user_id: string;
  recipe_id: string;
  title: string;
  description: string;
  max_participants: number;
  current_participants: number;
  event_date: string;
  location: string;
  image_url?: string;
  created_at: string;
}

export interface EventCreate {
  title: string;
  description: string;
  max_participants: number;
  event_date: string;
  location: string;
}

export interface JoinEventRequest {
  user_id: string;
  event_id: string;
}

// Token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token if it exists
const token = getAuthToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to ensure token is always included
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('401 Error - clearing token and redirecting to login');
      // Token might be invalid, clear it
      removeAuthToken();
      // Only redirect to login if not already there and not on create-event page
      if (window.location.pathname !== '/login' && 
          window.location.pathname !== '/signup' &&
          window.location.pathname !== '/create-event') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Users API
export const createUser = async (userData: UserCreate): Promise<User> => {
  const response = await api.post('/users/', userData);
  return response.data;
};

export const loginUser = async (loginData: UserLogin): Promise<LoginResponse> => {
  const response = await api.post('/users/login', loginData);
  return response.data;
};

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserRecipes = async (userId: string): Promise<Recipe[]> => {
  const response = await api.get(`/users/${userId}/recipes`);
  return response.data;
};

export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const response = await api.get(`/users/${userId}/events`);
  return response.data;
};

// Recipes API
export const createRecipe = async (recipeData: RecipeCreate): Promise<Recipe> => {
  const response = await api.post('/recipes/', recipeData);
  return response.data;
};

export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  const response = await api.get(`/recipes/${recipeId}`);
  return response.data;
};

// Events API
export const createEvent = async (eventData: EventCreate | FormData): Promise<Event> => {
  // If eventData is FormData, we need to send it with multipart/form-data content type
  const config = eventData instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};

  const response = await api.post('/events/', eventData, config);
  return response.data;
};

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events/');
  return response.data;
};

export const getEvent = async (eventId: string): Promise<Event> => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const joinEvent = async (joinData: JoinEventRequest): Promise<{ message: string; event_id: string }> => {
  const response = await api.post('/events/join/', joinData);
  return response.data;
};

export const getMyEvents = async (): Promise<Event[]> => {
  const response = await api.get('/users/me/events');
  return response.data;
};

export const getJoinedEvents = async (): Promise<Event[]> => {
  const response = await api.get('/users/me/joined-events');
  return response.data;
};

export default api;
