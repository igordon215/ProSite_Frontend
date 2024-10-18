import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import './Blog.css';

interface BlogSectionProps {
  blogPosts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ blogPosts }) => {
  return (
    <section id="blog" className="blog">
      <h2 className="text-3xl font-bold text-center heading-color">Sunday Morning Coffee and Code</h2>
      <div className="blog-grid">
        {blogPosts.slice(0, 4).map((post) => (
          <div key={post.id} className="blog-card">
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <Link to={`/blog/${post.id}`} className="read-more">Explore Full Article</Link>
          </div>
        ))}
      </div>
      <Link to="/blog" className="view-more">View Blog Posts</Link>
    </section>
  );
};

export default BlogSection;
