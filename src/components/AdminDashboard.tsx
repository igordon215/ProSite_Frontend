import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  createProject,
  createBlogPost,
  getAllProjects,
  getAllBlogPosts,
  updateProject,
  updateBlogPost,
  deleteProject,
  deleteBlogPost,
  handleApiError
} from '../api';
import { Project, BlogPost } from '../types';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    technologies: [],
  });
  const [newBlogPost, setNewBlogPost] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>({
    title: '',
    content: '',
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchBlogPosts();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getAllProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError('Failed to fetch projects');
      handleApiError(err);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const fetchedBlogPosts = await getAllBlogPosts();
      setBlogPosts(fetchedBlogPosts);
    } catch (err) {
      setError('Failed to fetch blog posts');
      handleApiError(err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const projectToAdd: Omit<Project, 'id'> = {
        ...newProject,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const addedProject = await createProject(projectToAdd);
      setProjects([...projects, addedProject]);
      setNewProject({ name: '', description: '', technologies: [] });
    } catch (err) {
      setError('Failed to add project. Please try again.');
      handleApiError(err);
    }
  };

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const blogPostToAdd: Omit<BlogPost, 'id'> = {
        ...newBlogPost,
        authorId: 'admin', // Replace with actual author ID if available
        createdAt: '', // This will be set by the server
        updatedAt: '', // This will be set by the server
      };
      const addedBlogPost = await createBlogPost(blogPostToAdd);
      setBlogPosts([...blogPosts, addedBlogPost]);
      setNewBlogPost({ title: '', content: '' });
    } catch (err) {
      setError('Failed to add blog post. Please try again.');
      handleApiError(err);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setError(null);
    try {
      const updatedProject = await updateProject(editingProject.id, editingProject);
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setEditingProject(null);
    } catch (err) {
      setError('Failed to update project. Please try again.');
      handleApiError(err);
    }
  };

  const handleEditBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogPost) return;
    setError(null);
    try {
      const updatedBlogPost = await updateBlogPost(editingBlogPost.id, editingBlogPost);
      setBlogPosts(blogPosts.map(p => p.id === updatedBlogPost.id ? updatedBlogPost : p));
      setEditingBlogPost(null);
    } catch (err) {
      setError('Failed to update blog post. Please try again.');
      handleApiError(err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    setError(null);
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      handleApiError(err);
    }
  };

  const handleDeleteBlogPost = async (id: number) => {
    setError(null);
    try {
      await deleteBlogPost(id);
      setBlogPosts(blogPosts.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete blog post. Please try again.');
      handleApiError(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateArray: number[]) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
      console.error('Invalid date array:', dateArray);
      return 'Invalid Date';
    }
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateArray);
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {error && <p className="error-message">{error}</p>}
      
      <div className="admin-section">
        <h2>Projects</h2>
        <ul className="item-list">
          {projects.map(project => (
            <li key={project.id} className="item">
              <div className="item-content">
                <div className="item-info">
                  <span className="item-name">{project.name}</span>
                  <span className="item-date">Created: {formatDate(project.createdAt as number[])}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditingProject(project)}>Edit</button>
                  <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="form-wrapper">
          {editingProject ? (
            <form onSubmit={handleEditProject} className="edit-form">
              <h3>Edit Project</h3>
              <label htmlFor="edit-project-name">Project Name:</label>
              <input
                id="edit-project-name"
                type="text"
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                required
              />
              <label htmlFor="edit-project-description">Project Description:</label>
              <textarea
                id="edit-project-description"
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                required
              />
              <label htmlFor="edit-project-technologies">Technologies (comma-separated):</label>
              <input
                id="edit-project-technologies"
                type="text"
                value={editingProject.technologies?.join(', ') || ''}
                onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
              />
              <div className="form-buttons">
                <button type="submit">Update Project</button>
                <button type="button" onClick={() => setEditingProject(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddProject} className="add-form">
              <h3>Add New Project</h3>
              <label htmlFor="new-project-name">Project Name:</label>
              <input
                id="new-project-name"
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
              <label htmlFor="new-project-description">Project Description:</label>
              <textarea
                id="new-project-description"
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                required
              />
              <label htmlFor="new-project-technologies">Technologies (comma-separated):</label>
              <input
                id="new-project-technologies"
                type="text"
                placeholder="e.g. React, Node.js, MongoDB"
                value={newProject.technologies?.join(', ') || ''}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
              />
              <button type="submit">Add Project</button>
            </form>
          )}
        </div>
      </div>
      
      <div className="admin-section">
        <h2>Blog Posts</h2>
        <ul className="item-list">
          {blogPosts.map(post => (
            <li key={post.id} className="item">
              <div className="item-content">
                <div className="item-info">
                  <span className="item-name">{post.title}</span>
                  <span className="item-date">Created: {formatDate(post.createdAt as number[])}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditingBlogPost(post)}>Edit</button>
                  <button onClick={() => handleDeleteBlogPost(post.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="form-wrapper">
          {editingBlogPost ? (
            <form onSubmit={handleEditBlogPost} className="edit-form">
              <h3>Edit Blog Post</h3>
              <label htmlFor="edit-blog-title">Blog Post Title:</label>
              <input
                id="edit-blog-title"
                type="text"
                value={editingBlogPost.title}
                onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                required
              />
              <label htmlFor="edit-blog-content">Blog Post Content:</label>
              <textarea
                id="edit-blog-content"
                value={editingBlogPost.content}
                onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                required
              />
              <div className="form-buttons">
                <button type="submit">Update Blog Post</button>
                <button type="button" onClick={() => setEditingBlogPost(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddBlogPost} className="add-form">
              <h3>Add New Blog Post</h3>
              <label htmlFor="new-blog-title">Blog Post Title:</label>
              <input
                id="new-blog-title"
                type="text"
                placeholder="Enter blog post title"
                value={newBlogPost.title}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                required
              />
              <label htmlFor="new-blog-content">Blog Post Content:</label>
              <textarea
                id="new-blog-content"
                placeholder="Enter blog post content"
                value={newBlogPost.content}
                onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                required
              />
              <button type="submit">Add Blog Post</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
