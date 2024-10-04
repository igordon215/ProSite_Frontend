import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, handleApiError } from '../api';
import { Project as ProjectType } from '../types';

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const fetchedProject = await getProjectById(parseInt(id, 10));
        setProject(fetchedProject);
        setError(null);
      } catch (error) {
        handleApiError(error);
        setError('Failed to fetch project. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!project) {
    return <div className="error">Project not found.</div>;
  }

  return (
    <div className="project">
      <Link to="/" className="back-link">Back to Home</Link>
      <h1>{project.name}</h1>
      <p className="description">{project.description}</p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="technologies">
          <h2>Technologies Used:</h2>
          <ul>
            {project.technologies.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Project;