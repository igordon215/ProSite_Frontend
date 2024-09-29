import React from 'react';
import './Intro.css';

const IntroSection: React.FC = () => {
  return (
    <>
      <div className="intro-container">
        <p className="bold-intro">Hi, I'm Ian Gordon</p>
        <p className="intro intro-background text-left">
          Full-stack developer, UX/UI designer based out of the Greater Philadelphia, PA area.
          <br /> I specialize in creating engaging designs and solving complex problems through innovative technology solutions.
          <br /> <br />
          With a passion for both front-end aesthetics and back-end functionality, I bring a holistic approach to web development. My goal is to craft user-centric experiences that are not only visually appealing but also intuitive and efficient.
        </p>
      </div>
      <a href="#contact" className="cta-button">Let's Build the Future Together</a>
    </>
  );
};

export default IntroSection;