import React, { useState } from "react";
import './Auth.css'; // This file will now control all the styling

function Home() {
  const [message, setMessage] = useState("");

  const fetchMessage = () => {
    fetch("http://127.0.0.1:5000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching message"));
  };

  return (
    // 1. Use .auth-page as the full-screen wrapper
    //    We add style overrides to allow scrolling
    <div 
      className="auth-page" 
      style={{ alignItems: 'flex-start', overflowY: 'auto' }}
    >
      {/* 2. Use .auth-container to center the content */}
      <div className="auth-container">
        
        {/* 3. Use .auth-card as the white box for ALL content */}
        {/* We add margin to create the space you can scroll into */}
        <div 
          className="auth-card" 
          style={{ marginTop: '5rem', marginBottom: '5rem' }}
        >

          {/* All your original content is now inside .auth-card */}
          
          {/* About Us Section */}
          {/* The h1 and p tags will be styled by .auth-card h1 and .auth-card p */}
          <section>
            <h1>About Us</h1>
            <p>
              Big facts go here — About Us section
            </p>
            {/* The background image and layout styles are removed */}
          </section>

          {/* Our Mission Section */}
          <section style={{ marginTop: '2rem' }}>
            <h2>Our Mission</h2>
            <p style={{ textAlign: 'left' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div>
              {/* Image is retained, but will be constrained by the card width */}
              <img
                src="/mission.jpg"
                alt="Our Mission"
                style={{ width: "100%", borderRadius: "8px", marginTop: '1rem' }}
              />
            </div>
          </section>

          {/* Our Story Section */}
          <section style={{ marginTop: '2rem' }}>
            <h2>Our Story</h2>
            <div>
              <img
                src="/story.jpg"
                alt="Our Story"
                style={{ width: "100%", borderRadius: "8px", marginBottom: '1rem' }}
              />
            </div>
            <p style={{ textAlign: 'left' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          {/* Backend Message Button */}
          <div style={{ marginTop: '2rem' }}>
            {/* 4. The .submit-button class is applied here */}
            <button
              onClick={fetchMessage}
              className="submit-button"
            >
              Get Message from Backend
            </button>
            {message && (
              <p style={{ marginTop: "1rem", fontStyle: "italic" }}>{message}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;