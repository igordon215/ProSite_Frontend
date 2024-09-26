// src/api.ts

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:8080/api'; // Adjust this URL as needed

// Define types based on the backend structure
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  // Add other properties as needed
}

export interface Project {
  id: number;
  name: string;
  description: string;
  technologies?: string[]; // Add technologies property
  // Add other properties as needed
}

export interface User {
  id: number;
  username: string;
  email: string;
  // Add other properties as needed
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// API functions for blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts`);
  return handleResponse(response);
};

export const getBlogPostById = async (id: number): Promise<BlogPost> => {
  const response = await fetch(`${API_BASE_URL}/blog-posts/${id}`);
  return handleResponse(response);
};

// API functions for projects
export const getAllProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  return handleResponse(response);
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);
  return handleResponse(response);
};

// API functions for users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return handleResponse(response);
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return handleResponse(response);
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