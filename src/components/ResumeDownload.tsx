import React from 'react';
import './ResumeDownload.css';

const ResumeDownload: React.FC = () => {
  return (
    <div className="resume-download-container">
      <h2 className="text-3xl font-bold text-center heading-color">Download My Resume</h2>
      <p>Get a comprehensive overview of my skills and experience.</p>
      <a href="/Ian_Gordon_Resume.pdf" download className="download-button">
        Download Resume
      </a>
    </div>
  );
};

export default ResumeDownload;
