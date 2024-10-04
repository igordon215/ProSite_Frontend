import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostById, handleApiError } from '../api';
import { BlogPost as BlogPostType } from '../types';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="blog-post">
      <Link to="/" className="back-link">Back to Home</Link>
      <h1>{post.title}</h1>
      <div className="content">{post.content}</div>
    </div>
  );
};

export default BlogPost;