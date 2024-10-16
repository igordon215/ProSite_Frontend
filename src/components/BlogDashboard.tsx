import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { createBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost, handleApiError } from '../api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface BlogDashboardProps {
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const BlogDashboard: React.FC<BlogDashboardProps> = ({ blogPosts, setBlogPosts, setError }) => {
  const [newBlogPost, setNewBlogPost] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>({
    title: '',
    content: '',
  });
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const fetchedBlogPosts = await getAllBlogPosts();
      setBlogPosts(fetchedBlogPosts);
    } catch (err) {
      setError('Failed to fetch blog posts');
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

  const formatDate = (dateInput: string | number[]) => {
    let date: Date;
    if (Array.isArray(dateInput)) {
      const [year, month, day, hour, minute, second] = dateInput;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(dateInput);
    }
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateInput);
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
    <div className="admin-section">
      <h2>Blog Posts</h2>
      <ul className="item-list">
        {blogPosts.map(post => (
          <li key={post.id} className="item">
            <div className="item-content">
              <div className="item-info">
                <span className="item-name">{post.title}</span>
                <span className="item-date">Created: {formatDate(post.createdAt)}</span>
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
            <CKEditor
              editor={ClassicEditor}
              data={editingBlogPost.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditingBlogPost({ ...editingBlogPost, content: data });
              }}
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
            <CKEditor
              editor={ClassicEditor}
              data={newBlogPost.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setNewBlogPost({ ...newBlogPost, content: data });
              }}
            />
            <button type="submit">Add Blog Post</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogDashboard;
