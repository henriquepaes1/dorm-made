import { httpClient, getAuthToken } from "./http-client";
import { User, UserCreate, UserUpdate } from "@/types";
import { Recipe } from "@/types";
import { Event } from "@/types";
import { Meal } from "@/types";

/**
 * User Service
 * Handles user-related API calls
 */

/**
 * Create a new user (signup)
 */
export const createUser = async (userData: UserCreate): Promise<User> => {
  const response = await httpClient.post("/users/", userData);
  return response.data;
};

/**
 * Get user by ID
 */
export const getUser = async (userId: string): Promise<User> => {
  console.log(`Fetching user with ID: ${userId}`);
  console.log(`Full URL will be: ${httpClient.defaults.baseURL}/users/${userId}`);
  const response = await httpClient.get(`/users/${userId}`);
  console.log("User response:", response.data);
  return response.data;
};

/**
 * Update user profile
 */
export const updateUser = async (userId: string, userUpdate: UserUpdate): Promise<User> => {
  console.log(`Updating user ${userId} with:`, userUpdate);
  const response = await httpClient.patch(`/users/${userId}`, userUpdate);
  console.log("Updated user response:", response.data);
  return response.data;
};

/**
 * Upload profile picture for a user
 */
export const uploadProfilePicture = async (userId: string, file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("image", file);

  const url = `/users/${userId}/profile-picture`;
  const fullUrl = `${httpClient.defaults.baseURL}${url}`;

  console.log("[DEBUG] Upload Profile Picture:", {
    userId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    url,
    fullUrl,
    baseURL: httpClient.defaults.baseURL,
    hasToken: !!getAuthToken(),
  });

  const response = await httpClient.post(url, formData);
  console.log("[DEBUG] Upload successful:", response.data);
  return response.data;
};

/**
 * Get all recipes created by a user
 */
export const getUserRecipes = async (userId: string): Promise<Recipe[]> => {
  const response = await httpClient.get(`/users/${userId}/recipes`);
  return response.data;
};

/**
 * Get all events created by a user
 */
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const response = await httpClient.get(`/users/${userId}/events`);
  return response.data;
};

/**
 * Get all meals created by a user
 */
export const getUserMeals = async (userId: string): Promise<Meal[]> => {
  const response = await httpClient.get(`/users/${userId}/meals`);
  return response.data;
};

/**
 * Search users by query string
 */
export const searchUsers = async (query: string, limit: number = 10): Promise<User[]> => {
  const response = await httpClient.get("/users/search", {
    params: { query, limit },
  });
  return response.data;
};
