import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, Project } from '../types';
import TypedWelcome from './TypedWelcome';
import AboutMe from './AboutMe';
import IntroSection from './IntroSection';
import Projects from './Projects';
import Login from './Login';

interface HomeProps {
  blogPosts: BlogPost[];
  projects: Project[];
}

const Home: React.FC<HomeProps> = ({ blogPosts, projects }) => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" alt="IG Codes Logo" className="small-logo" />
          </div>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="logo-container" style={{ marginTop: '-20px' }}>
          <img src="/logo.png" alt="IG Codes Logo" className="logo" />
        </div>
      </header>

      <main className="main-content">
        <section id="home" className="hero">
          <div style={{ marginTop: '-100px' }}>
            <TypedWelcome />
          </div>
          <IntroSection />
        </section>

        <section id="about" className="about">
          <AboutMe />
        </section>

        <Projects projects={projects} />

        <section id="blog" className="blog">
          <h2>Tech Insights & Industry Trends</h2>
          <div className="blog-grid">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="blog-card">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 100)}...</p>
                <Link to={`/blog/${post.id}`} className="read-more">Explore Full Article</Link>
              </div>
            ))}
          </div>
          <Link to="/blog" className="view-more">Access the Knowledge Hub</Link>
        </section>

        <section id="contact" className="contact">
          <h2>Embark on Your Digital Transformation Journey</h2>
          <p>Ready to revolutionize your business with cutting-edge technology? Let's collaborate to create solutions that will set you apart in the digital landscape.</p>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Describe Your Vision" required></textarea>
            <button type="submit" className="submit-button">Initiate Innovation</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2023 IG Codes. Empowering businesses through advanced software solutions.</p>
      </footer>

      <Login />
    </div>
  );
};

export default Home;