import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostById, handleApiError } from '../../api';
import { BlogPost as BlogPostType } from '../../types';
import DOMPurify from 'dompurify';
import './Blog.css';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format the date
  const formatDate = (dateInput: string | number[]) => {
    let date: Date;
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
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
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const fetchedPost = await getBlogPostById(parseInt(id, 10));
        setPost(fetchedPost);
        setError(null);
      } catch (error) {
        handleApiError(error);
        setError('Failed to fetch blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="error">Blog post not found.</div>;
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="full-blog-post">
      <h1>{post.title}</h1>
      <div className="meta">
        <span className="date">Published on {formatDate(post.createdAt)}</span>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <Link to="/" className="view-more back-button">Back to Home</Link>
    </div>
  );
};

export default BlogPost;
