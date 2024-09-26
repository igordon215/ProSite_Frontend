import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAllBlogPosts, getAllProjects, handleApiError } from './api';
import Home from './components/Home';
import BlogPost from './components/BlogPost';
import Project from './components/Project';
import { BlogPost as BlogPostType, Project as ProjectType } from './types';
import './App.css';

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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home blogPosts={blogPosts} projects={projects} />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
