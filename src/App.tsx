import { useState, useEffect } from 'react'
import './App.css'

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Simulating fetching projects from an API
    setProjects([
      { id: 1, title: "Project Alpha", description: "A cutting-edge web application", image: "https://via.placeholder.com/300x200" },
      { id: 2, title: "Project Beta", description: "An innovative mobile app", image: "https://via.placeholder.com/300x200" },
      { id: 3, title: "Project Gamma", description: "A powerful data analysis tool", image: "https://via.placeholder.com/300x200" },
    ]);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <h1 className="animate-fade-in">Ian's Tech Universe</h1>
          <p className="animate-fade-in-delay">Crafting digital experiences that inspire</p>
        </section>

        <section id="about" className="about">
          <h2>About Me</h2>
          <p>I'm a passionate software developer with a keen eye for design and a drive for innovation. With expertise in modern web technologies and a commitment to clean, efficient code, I bring ideas to life in the digital realm.</p>
        </section>

        <section id="projects" className="projects">
          <h2>Featured Projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <img src={project.image} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Get in Touch</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <input type="email" placeholder="Your email" required />
            <textarea placeholder="Your message" required></textarea>
            <button type="submit">Send</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2023 Ian's Tech Universe. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
