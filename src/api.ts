// src/api.ts
import { BlogPost, Project } from './types';

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:8080/api'; // Adjust this URL as needed

// Helper function to get the JWT token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Helper function to set the JWT token in localStorage
const setAuthToken = (token: string) => localStorage.setItem('authToken', token);

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Helper function to create headers with authentication
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function to create headers without authentication
const createPublicHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// API functions for authentication
export const login = async (username: string, password: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: createPublicHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(response);
  setAuthToken(data.token); // Store the token
  return data.token;
};

export const register = async (username: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: createPublicHeaders(),
    body: JSON.stringify({ username, password }),
  });
  await handleResponse(response);
};

// API functions for blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts`, {
    headers: createPublicHeaders(),
  });
  return handleResponse(response);
};

export const getBlogPostById = async (id: number): Promise<BlogPost> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts/${id}`, {
    headers: createPublicHeaders(),
  });
  return handleResponse(response);
};

export const createBlogPost = async (blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(blogPost),
  });
  return handleResponse(response);
};

export const updateBlogPost = async (id: number, blogPost: Partial<BlogPost>): Promise<BlogPost> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts/${id}`, {
    method: 'PUT',
    headers: createAuthHeaders(),
    body: JSON.stringify(blogPost),
  });
  return handleResponse(response);
};

export const deleteBlogPost = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts/${id}`, {
    method: 'DELETE',
    headers: createAuthHeaders(),
  });
  await handleResponse(response);
};

// API functions for projects
export const getAllProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: createPublicHeaders(),
  });
  return handleResponse(response);
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: createPublicHeaders(),
  });
  return handleResponse(response);
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: createAuthHeaders(),
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

export const deleteProject = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: createAuthHeaders(),
  });
  await handleResponse(response);
};

// Error handling utility function
export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // You can add more error handling logic here, such as displaying a notification to the user
  } else {
    console.error('An unknown error occurred', error);
  }
};
