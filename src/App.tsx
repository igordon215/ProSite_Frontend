import { useState, useEffect } from 'react';
import { getAllBlogPosts, getAllProjects, handleApiError } from './api';
import './App.css';

interface BlogPost {
  id: number;
  title: string;
  content: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  technologies?: string[]; // Make technologies optional
}

function App() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedBlogPosts, fetchedProjects] = await Promise.all([
          getAllBlogPosts(),
          getAllProjects()
        ]);

        setBlogPosts(fetchedBlogPosts);
        setProjects(fetchedProjects);
        setError(null);
      } catch (error) {
        handleApiError(error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <header className="header">
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
          <h1>Innovate with Ian</h1>
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
              </div>
            ))}
          </div>
          <a href="#" className="view-more">Discover More Groundbreaking Projects</a>
        </section>

        <section id="blog" className="blog">
          <h2>Tech Insights & Industry Trends</h2>
          <div className="blog-grid">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="blog-card">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 100)}...</p>
                <a href="#" className="read-more">Explore Full Article</a>
              </div>
            ))}
          </div>
          <a href="#" className="view-more">Access the Knowledge Hub</a>
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
        <p>&copy; 2023 Ian's Tech Innovation Studio. Empowering businesses through advanced software solutions.</p>
      </footer>
    </div>
  );
}

export default App;
