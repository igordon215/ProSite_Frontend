import React, { useEffect } from 'react';
import { BlogPost, Project } from '../types';
import TypedWelcome from './TypedWelcome';
import AboutMe from './AboutMe';
import IntroSection from './IntroSection';
import Projects from './Projects';
import Login from './Login';
import ResumeDownload from './ResumeDownload';
import ContactForm from './ContactForm';
import BlogSection from './BlogSection';
import './Blog.css';

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
              <li><a href="#resume">Resume</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
              <li style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                <a href="https://www.linkedin.com/in/iangordoncodes/" target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                  <img src="/linkedin.png" alt="LinkedIn" style={{ width: '32px', height: '32px', verticalAlign: 'middle' }} />
                </a>
                <a href="https://github.com/igordon215" target="_blank" rel="noopener noreferrer">
                  <img src="/github.png" alt="GitHub" style={{ width: '32px', height: '32px', verticalAlign: 'middle' }} />
                </a>
              </li>
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

        <section id="resume">
          <ResumeDownload />
        </section>

        <Projects projects={projects} />

        <BlogSection blogPosts={blogPosts} />

        <ContactForm />
      </main>

      <footer>
        <p>&copy; 2024 IG Codes</p>
      </footer>

      <Login />
    </div>
  );
};

export default Home;
