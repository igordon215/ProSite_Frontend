import React, { useEffect, useState, useCallback } from 'react';
import './TypedWelcome.css';

const TypedWelcome: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Adjustable speed parameters (in milliseconds)
  const TYPING_SPEED = 700;  // Speed for typing each character
  const DELETING_SPEED = 300; // Speed for deleting each character
  const PAUSE_DURATION = 4000; // Duration to pause after typing a full word

  const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);

  const welcomeMessages = ['Welcome', 'Bienvenido', 'مرحباً', 'Bienvenu', 'Willkommen'];

  const getCurrentMessage = useCallback(() => {
    return welcomeMessages[loopNum % welcomeMessages.length];
  }, [loopNum]);

  useEffect(() => {
    const currentMessage = getCurrentMessage();

    const handleTyping = () => {
      if (!isDeleting && charIndex < currentMessage.length) {
        // Typing
        setText(currentMessage.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        setTypingSpeed(TYPING_SPEED);
      } else if (!isDeleting && charIndex === currentMessage.length) {
        // Finished typing, pause before deleting
        setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(DELETING_SPEED);
        }, PAUSE_DURATION);
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        setText(currentMessage.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        setTypingSpeed(DELETING_SPEED);
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(TYPING_SPEED);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, loopNum, typingSpeed, getCurrentMessage]);

  return (
    <div className="welcome-message-container">
      <h1 className="welcome-message">
        <span>{text}</span>
        <span className="cursor"></span>
      </h1>
    </div>
  );
};

export default TypedWelcome;