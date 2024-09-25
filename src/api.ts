import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust this to match your backend URL

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
}

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects`);
    console.log('Fetched projects:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching projects:', error.message);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
};

// You can add more API functions here as needed, for example:
// export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
//   const response = await axios.post(`${API_BASE_URL}/api/projects`, project);
//   return response.data;
// };