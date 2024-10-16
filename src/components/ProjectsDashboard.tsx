import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { createProject, getAllProjects, updateProject, deleteProject, handleApiError } from '../api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface ProjectsDashboardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({ projects, setProjects, setError }) => {
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    technologies: [],
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getAllProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError('Failed to fetch projects');
      handleApiError(err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const projectToAdd: Omit<Project, 'id'> = {
        ...newProject,
        title: newProject.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const addedProject = await createProject(projectToAdd);
      setProjects([...projects, addedProject]);
      setNewProject({ name: '', description: '', technologies: [] });
    } catch (err) {
      setError('Failed to add project. Please try again.');
      handleApiError(err);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setError(null);
    try {
      const updatedProject = await updateProject(editingProject.id, {
        ...editingProject,
        title: editingProject.name,
      });
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setEditingProject(null);
    } catch (err) {
      setError('Failed to update project. Please try again.');
      handleApiError(err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    setError(null);
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      handleApiError(err);
    }
  };

  const formatDate = (dateInput: string | number[]) => {
    let date: Date;
    if (Array.isArray(dateInput)) {
      const [year, month, day, hour, minute, second] = dateInput;
      date = new Date(year, month - 1, day, hour, minute, second);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className="admin-section">
      <h2>Projects</h2>
      <ul className="item-list">
        {projects.map(project => (
          <li key={project.id} className="item">
            <div className="item-content">
              <div className="item-info">
                <span className="item-name">{project.name}</span>
                <span className="item-date">Created: {formatDate(project.createdAt)}</span>
              </div>
              <div className="item-actions">
                <button onClick={() => setEditingProject(project)}>Edit</button>
                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="form-wrapper">
        {editingProject ? (
          <form onSubmit={handleEditProject} className="edit-form">
            <h3>Edit Project</h3>
            <label htmlFor="edit-project-name">Project Name:</label>
            <input
              id="edit-project-name"
              type="text"
              value={editingProject.name}
              onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              required
            />
            <label htmlFor="edit-project-description">Project Description:</label>
            <CKEditor
              editor={ClassicEditor}
              data={editingProject.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditingProject({ ...editingProject, description: data });
              }}
            />
            <label htmlFor="edit-project-technologies">Technologies (comma-separated):</label>
            <input
              id="edit-project-technologies"
              type="text"
              value={editingProject.technologies?.join(', ') || ''}
              onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
            />
            <div className="form-buttons">
              <button type="submit">Update Project</button>
              <button type="button" onClick={() => setEditingProject(null)}>Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddProject} className="add-form">
            <h3>Add New Project</h3>
            <label htmlFor="new-project-name">Project Name:</label>
            <input
              id="new-project-name"
              type="text"
              placeholder="Enter project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
            <label htmlFor="new-project-description">Project Description:</label>
            <CKEditor
              editor={ClassicEditor}
              data={newProject.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setNewProject({ ...newProject, description: data });
              }}
            />
            <label htmlFor="new-project-technologies">Technologies (comma-separated):</label>
            <input
              id="new-project-technologies"
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={newProject.technologies?.join(', ') || ''}
              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
            />
            <button type="submit">Add Project</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;
