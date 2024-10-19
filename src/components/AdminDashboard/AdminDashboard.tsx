import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Project, BlogPost } from '../../types';
import './AdminDashboard.css';
import ProjectsDashboard from './ProjectsDashboard';
import BlogDashboard from './BlogDashboard';
import { getAllProjects, getAllBlogPosts, handleApiError } from '../../api';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const memoizedSetProjects = useCallback((newProjects: Project[] | ((prevProjects: Project[]) => Project[])) => {
    setProjects(newProjects);
  }, []);

  const memoizedSetBlogPosts = useCallback((newBlogPosts: BlogPost[] | ((prevBlogPosts: BlogPost[]) => BlogPost[])) => {
    setBlogPosts(newBlogPosts);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fetchedProjects, fetchedBlogPosts] = await Promise.all([
          getAllProjects(),
          getAllBlogPosts()
        ]);
        memoizedSetProjects(fetchedProjects);
        memoizedSetBlogPosts(fetchedBlogPosts);
      } catch (err) {
        setError('Failed to fetch initial data');
        handleApiError(err);
      }
    };

    fetchInitialData();
  }, [memoizedSetProjects, memoizedSetBlogPosts]);

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
        setProjects={memoizedSetProjects}
        setError={setError}
      />
      
      <BlogDashboard 
        blogPosts={blogPosts}
        setBlogPosts={memoizedSetBlogPosts}
        setError={setError}
      />
    </div>
  );
};

export default AdminDashboard;
