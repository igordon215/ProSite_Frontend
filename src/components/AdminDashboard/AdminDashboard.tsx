import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Project, BlogPost } from '../../types';
import './AdminDashboard.css';
import ProjectsDashboard from './ProjectsDashboard';
import BlogDashboard from './BlogDashboard';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {error && <p className="error-message">{error}</p>}
      
      <ProjectsDashboard 
        projects={projects}
        setProjects={setProjects}
        setError={setError}
      />
      
      <BlogDashboard 
        blogPosts={blogPosts}
        setBlogPosts={setBlogPosts}
        setError={setError}
      />
    </div>
  );
};

export default AdminDashboard;
