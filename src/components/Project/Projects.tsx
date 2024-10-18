import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import './Projects.css';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="projects" className="projects">
      <h2 className="text-3xl font-bold text-center heading-color">Project Portfolio</h2>
      <div className="project-grid">
        {projects.slice(0, 4).map((project) => (
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
      <Link to="/projects" className="view-more">Discover More Projects</Link>
    </section>
  );
};

export default Projects;
