import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement the actual email sending logic here
    // This will require a backend service
    console.log('Form submitted:', { name, email, message });
    // Reset form fields after submission
    setName('');
    setEmail('');
    setMessage('');
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <section id="contact" className="contact">
      <h2>Embark on Your Digital Transformation Journey</h2>
      <p>Ready to revolutionize your business with cutting-edge technology? Let's collaborate to create solutions that will set you apart in the digital landscape.</p>
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
          placeholder="Describe Your Vision"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit" className="submit-button">Initiate Innovation</button>
      </form>
    </section>
  );
};

export default ContactForm;
