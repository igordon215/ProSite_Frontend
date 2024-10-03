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
import './AdminDashboard.css'; // We'll create this file next

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'admin', // You might want to replace this with the actual author ID
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

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {error && <p className="error-message">{error}</p>}
      
      <div className="admin-section">
        <h2>Projects</h2>
        <ul className="item-list">
          {projects.map(project => (
            <li key={project.id}>
              <span>{project.name}</span>
              <div>
                <button onClick={() => setEditingProject(project)}>Edit</button>
                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        
        {editingProject ? (
          <form onSubmit={handleEditProject} className="edit-form">
            <h3>Edit Project</h3>
            <input
              type="text"
              value={editingProject.name}
              onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              required
            />
            <textarea
              value={editingProject.description}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              required
            />
            <input
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
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={newProject.technologies?.join(', ') || ''}
              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
            />
            <button type="submit">Add Project</button>
          </form>
        )}
      </div>

      <div className="admin-section">
        <h2>Blog Posts</h2>
        <ul className="item-list">
          {blogPosts.map(post => (
            <li key={post.id}>
              <span>{post.title}</span>
              <div>
                <button onClick={() => setEditingBlogPost(post)}>Edit</button>
                <button onClick={() => handleDeleteBlogPost(post.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        
        {editingBlogPost ? (
          <form onSubmit={handleEditBlogPost} className="edit-form">
            <h3>Edit Blog Post</h3>
            <input
              type="text"
              value={editingBlogPost.title}
              onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
              required
            />
            <textarea
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
            <input
              type="text"
              placeholder="Blog Post Title"
              value={newBlogPost.title}
              onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Blog Post Content"
              value={newBlogPost.content}
              onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
              required
            />
            <button type="submit">Add Blog Post</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;