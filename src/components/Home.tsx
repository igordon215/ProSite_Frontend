import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, Project } from '../types';

interface HomeProps {
  blogPosts: BlogPost[];
  projects: Project[];
}

const Home: React.FC<HomeProps> = ({ blogPosts, projects }) => {
  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="IG Codes Logo" className="logo" />
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
      </header>

      <main>
        <section id="home" className="hero">
          <p className="tagline">Elevating Businesses through Cutting-Edge Software Solutions</p>
          <a href="#contact" className="cta-button">Let's Build the Future Together</a>
        </section>

        <section id="about" className="about">
          <h2>Transforming Ideas into Digital Realities</h2>
          <p>As a passionate software architect and developer, I specialize in creating bespoke solutions that drive business growth and user engagement. My expertise includes:</p>
          <ul className="skills-list">
            <li>Scalable Web Applications</li>
            <li>Cross-Platform Mobile Development</li>
            <li>Cloud-Native Architectures</li>
            <li>AI-Powered Software Solutions</li>
            <li>Blockchain Integration</li>
          </ul>
          <p>With a proven track record of delivering innovative projects, I'm here to turn your vision into a technological masterpiece.</p>
        </section>

        <section id="projects" className="projects">
          <h2>Innovative Solutions Showcase</h2>
          <div className="project-grid">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="tech-stack">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
                <Link to={`/project/${project.id}`} className="view-more">View Project</Link>
              </div>
            ))}
          </div>
          <Link to="/projects" className="view-more">Discover More Groundbreaking Projects</Link>
        </section>

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
    </div>
  );
};

export default Home;