import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAllBlogPosts, getAllProjects, handleApiError } from './api';
import Home from './components/Home';
import BlogPost from './components/BlogPost';
import BlogList from './components/BlogList';
import Project from './components/Project';
import AdminDashboard from './components/AdminDashboard';
import { BlogPost as BlogPostType, Project as ProjectType } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import './animatedBackground.css';

// ProtectedRoute component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedBlogPosts, fetchedProjects] = await Promise.all([
          getAllBlogPosts(),
          getAllProjects()
        ]);

        setBlogPosts(fetchedBlogPosts);
        setProjects(fetchedProjects);
        setError(null);
      } catch (error) {
        handleApiError(error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Animated Background */}
          <ul className="background">
            {[...Array(30)].map((_, index) => (
              <li key={index}></li>
            ))}
          </ul>
          
          {/* Main Content */}
          <div className="main-content">
            <div className="content">
              <Routes>
                <Route path="/" element={<Home blogPosts={blogPosts} projects={projects} />} />
                <Route path="/blog" element={<BlogList blogPosts={blogPosts} />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/project/:id" element={<Project />} />
                <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
