import React, { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '../../types';
import { createBlogPost, updateBlogPost, deleteBlogPost, handleApiError } from '../../api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface BlogDashboardProps {
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const BlogDashboard: React.FC<BlogDashboardProps> = ({ blogPosts, setBlogPosts, setError }) => {
  const [localBlogPosts, setLocalBlogPosts] = useState<BlogPost[]>(blogPosts);
  const [newBlogPost, setNewBlogPost] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>({
    title: '',
    content: '',
  });
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  useEffect(() => {
    setLocalBlogPosts(blogPosts);
  }, [blogPosts, updateTrigger]);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const tempId = Date.now();
    const optimisticBlogPost: BlogPost = {
      ...newBlogPost,
      id: tempId,
      authorId: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setLocalBlogPosts(prevPosts => [...prevPosts, optimisticBlogPost]);
    
    try {
      const addedBlogPost = await createBlogPost(optimisticBlogPost);
      setBlogPosts(prevPosts => [...prevPosts, addedBlogPost]);
      setNewBlogPost({ title: '', content: '' });
      forceUpdate();
    } catch (err) {
      setLocalBlogPosts(prevPosts => prevPosts.filter(post => post.id !== tempId));
      setError('Failed to add blog post. Please try again.');
      handleApiError(err);
    }
  };

  const handleEditBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogPost) return;
    setError(null);
    
    const updatedPost = { ...editingBlogPost, updatedAt: new Date().toISOString() };
    
    // Immediately update local state
    setLocalBlogPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    
    try {
      const updatedBlogPost = await updateBlogPost(updatedPost.id, updatedPost);
      setBlogPosts(prevPosts => prevPosts.map(post => post.id === updatedBlogPost.id ? updatedBlogPost : post));
      setEditingBlogPost(null);
      forceUpdate();
    } catch (err) {
      // Revert local state if the update fails
      setLocalBlogPosts(prevPosts => prevPosts.map(post => post.id === editingBlogPost.id ? blogPosts.find(p => p.id === editingBlogPost.id)! : post));
      setError('Failed to update blog post. Please try again.');
      handleApiError(err);
    }
  };

  const handleDeleteBlogPost = async (id: number) => {
    setError(null);
    const deletedPost = localBlogPosts.find(post => post.id === id);
    setLocalBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    
    try {
      await deleteBlogPost(id);
      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      forceUpdate();
    } catch (err) {
      if (deletedPost) {
        setLocalBlogPosts(prevPosts => [...prevPosts, deletedPost]);
      }
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
        {localBlogPosts.map(post => (
          <li key={`${post.id}-${post.updatedAt}-${updateTrigger}`} className="item">
            <div className="item-content">
              <div className="item-info">
                <span className="item-name">{post.title}</span>
                <span className="item-date">Created: {formatDate(post.createdAt)}</span>
                <span className="item-date">Updated: {formatDate(post.updatedAt)}</span>
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
              key={editingBlogPost.id} // Add a key prop to force re-render
              editor={ClassicEditor}
              data={editingBlogPost.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditingBlogPost(prevPost => ({ ...prevPost!, content: data }));
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
