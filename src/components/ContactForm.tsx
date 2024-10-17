import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:8080/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('Thank you for your message. We will get back to you soon!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      setStatus('There was an error sending your message. Please try again.');
    }
  };

  return (
    <section id="contact" className="contact">
      <h2>Contact Me</h2>
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/iangordoncodes/" target="_blank" rel="noopener noreferrer" className="social-icon-link">
          <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/igordon215" target="_blank" rel="noopener noreferrer" className="social-icon-link">
          <img src="/github.png" alt="GitHub" className="social-icon" />
          <span>GitHub</span>
        </a>
      </div>
      <p>Let's Connect! Send Me A Message Below</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Your Message:"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit" className="submit-button">Send Connection</button>
        {status && <p className="status-message">{status}</p>}
      </form>
    </section>
  );
};

export default ContactForm;
