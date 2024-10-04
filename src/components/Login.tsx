import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, handleApiError } from '../api';

const Login: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      setIsLoading(false);
      return;
    }

    try {
      const token = await apiLogin(username, password);
      console.log('Login successful');
      
      // Use the login function from AuthContext to update the app state
      login(token);
      
      setIsOpen(false);
      // Redirect to AdminDashboard
      navigate('/admin');
    } catch (err: unknown) {
      handleApiError(err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="login-button"
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '5px 10px',
          fontSize: '12px',
          backgroundColor: 'transparent',
          border: '1px solid #ccc',
          borderRadius: '3px',
          cursor: 'pointer',
          opacity: 0.7,
        }}
      >
        Login
      </button>
      {isOpen && (
        <div className="login-modal" style={{
          position: 'fixed',
          bottom: '50px',
          right: '10px',
          padding: '20px',
          backgroundColor: 'black',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                display: 'block', 
                margin: '10px 0', 
                padding: '5px',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '3px',
                width: '100%',
              }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                display: 'block', 
                margin: '10px 0', 
                padding: '5px',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '3px',
                width: '100%',
              }}
              required
            />
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                opacity: isLoading ? 0.5 : 1,
                width: '100%',
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;