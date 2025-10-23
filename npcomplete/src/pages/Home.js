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
    <div 
      className="auth-page" 
    >
      {/* 2. Use .auth-container to center the content */}
      <div className="auth-container">
        
        {/* 3. Use .auth-card but add 'auth-card--wide' to override the width */}
        <div 
          className="auth-card auth-card--wide" 
        >
          
          {/* About Us Section */}
          {/* This section gets a new class for the gray background from the sketch */}
          <section className="home-section--about">
            <h1>About Us</h1>
            <p>
              Big facts go here — About Us section
            </p>
          </section>

          {/* Our Mission Section */}
          {/* This section now uses the 2-column layout class */}
          <section className="home-section--layout" style={{ marginTop: '2rem' }}>
            <div className="home-section__text">
              <h2>Our Mission</h2>
              <p style={{ textAlign: 'left' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div className="home-section__image">
              <img
                src="/mission.png"
                alt="Our Mission"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          </section>

          {/* Our Story Section */}
          {/* This section also uses the 2-column layout class */}
          {/* The visual order (image-left) is determined by the HTML order here */}
          <section className="home-section--layout" style={{ marginTop: '2rem' }}>
            <div className="home-section__image">
              <img
                src="/story.jpg"
                alt="Our Story"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
            <div className="home-section__text">
              <h2>Our Story</h2>
              <p style={{ textAlign: 'left' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </section>

          {/* Backend Message Button */}
          {/* Added a separator line for visual clarity */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid #e0e0e0', paddingTop: '2rem', textAlign: 'center' }}>
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