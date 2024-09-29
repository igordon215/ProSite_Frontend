import React, { useEffect } from 'react';
import './AboutMe.css';

const AboutMe: React.FC = () => {
  const techStackImages = [
    { src: "angular-removebg-preview.png", name: "Angular" },
    { src: "html-removebg-preview.png", name: "HTML" },
    { src: "java__1_-removebg-preview.png", name: "Java" },
    { src: "js.png", name: "JavaScript" },
    { src: "typescript .png", name: "TypeScript" },
    { src: "python-removebg-preview.png", name: "Python" },
    { src: "sql-removebg-preview.png", name: "SQL" },
    { src: "Postgresql_NoBG_White.png", name: "PostgreSQL" },
    { src: "science-removebg-preview.png", name: "React" },
    { src: "text-removebg-preview.png", name: "CSS" }
  ];

  useEffect(() => {
    console.log('Tech stack images:', techStackImages);
  }, []);

  return (
    <div className="my-8">
      <div className="mb-8">
        <div className="h2-container mb-4">
          <h2 className="text-3xl font-bold text-center text-orange-500">About Me</h2>
        </div>
        <div className="flex items-center p-6 intro intro-background">
          <img 
            src="/Circle_IG_avatar.png" 
            alt="Profile" 
            className="w-32 h-32 rounded-full mr-6"
          />
          <p className="text-lg text-left">
            With over a decade of experience as a precision machinist crafting spine
            implants, I'm now bringing my dedication to quality and problem-solving to
            software development. My background has sharpened my attention to detail
            and adaptability, skills I'm excited to apply to creating innovative software
            solutions. Passionate about blending logic and creativity, I'm eager to
            contribute fresh perspectives to the world of tech and help build tools that
            drive efficiency across industries.
          </p>
        </div>
      </div>

      <div>
        <div className="h2-container mb-4">
          <h2 className="text-3xl font-bold text-center text-orange-500">Experience</h2>
        </div>
        <div className="p-6 intro intro-background">
          <div className="tech-stack-scroll-container mb-4">
            <div className="tech-stack-scroll-inner">
              {[...techStackImages, ...techStackImages].map((image, index) => (
                <div key={index} className="tech-stack-item">
                  <img 
                    src={`/TechStackWebpage/${image.src}`} 
                    alt={image.name}
                    className="tech-stack-image"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.src}`);
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                    }}
                  />
                  <p className="tech-stack-name">{image.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <a href="https://zipcodewilmington.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mr-4">
              <img 
                src="/zipcode.png" 
                alt="Zip Code Wilmington" 
                className="w-14 h-auto rounded-lg cursor-pointer"
              />
            </a>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold">Zip Code Wilmington</h3>
              <p className="text-sm">June 2024 - September 2024</p>
            </div>
          </div>

          <p className="mb-4 text-left">
            I completed an intensive full-stack software development boot camp. I was selected from a highly
            competitive applicant pool (with an acceptance rate of less than 9%) and invested over 1000 hours in
            immersive software development projects, gaining comprehensive experience in both front-end and
            back-end technologies.
          </p>

          <h4 className="text-xl font-semibold mb-2 text-left">Key Achievements and Skills:</h4>
          <ul className="list-disc list-inside mb-4 text-left">
            <li>Mastered Java programming and object-oriented concepts</li>
            <li>Applied Agile and Scrum methodologies in collaborative team projects</li>
            <li>Implemented test-driven development practices</li>
            <li>Developed full-stack applications using various frameworks</li>
            <li>Collaborated with peers on coding projects, enhancing teamwork and communication skills</li>
          </ul>

          <p className="text-left">
            Throughout the program, I've cultivated a passion for creating innovative software solutions. I'm
            excited to apply my newly acquired skills to build impactful applications and contribute to the tech
            industry. Continuously striving to expand my knowledge and improve my coding abilities, I'm eager to
            take on new challenges in software development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;