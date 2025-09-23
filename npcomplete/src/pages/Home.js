import React, { useState } from 'react';

function Home() {
  const [message, setMessage] = useState('');

  const fetchMessage = () => {
    fetch('http://127.0.0.1:5000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error fetching message'));
  };

  return (
    <div className="page-container">
      <h1>Welcome to NPComplete</h1>
      <p>big facts go here</p>
      
      <div style={{ margin: '2rem 0' }}>
        <button onClick={fetchMessage} style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '1rem',
          backgroundColor: '#61dafb',
          color: '#282c34',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Get Message from Backend
        </button>
        {message && (
          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
