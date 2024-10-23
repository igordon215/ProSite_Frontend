import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import './BlogList.css';

interface BlogListProps {
  blogPosts: BlogPost[];
}

const BlogList: React.FC<BlogListProps> = ({ blogPosts }) => {
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

  return (
    <div className="App">
      <header className="header">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" alt="IG Codes Logo" className="small-logo" />
          </div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#projects">Projects</a></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="logo-container" style={{ marginTop: '-20px' }}>
          <img src="/logo.png" alt="IG Codes Logo" className="logo" />
        </div>
      </header>

      <main className="main-content">
        <section id="blog" className="blog">
          <h2>Sunday Morning Coffee and Code</h2>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <div key={post.id} className="blog-card">
                <h3>{post.title}</h3>
                <p className="blog-date">Created on: {formatDate(post.createdAt)}</p>
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <Link to={`/blog/${post.id}`} className="view-more">Read Full Article</Link>
              </div>
            ))}
          </div>
          <Link to="/" className="view-more back-button">Back to Home</Link>
        </section>
      </main>

      <footer>
        <p>&copy; 2023 IG Codes. Empowering businesses through advanced software solutions.</p>
      </footer>
    </div>
  );
};

export default BlogList;
