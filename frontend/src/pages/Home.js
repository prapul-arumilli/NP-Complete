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
              At NP Complete, we believe that giving back should be simple, personal, and impactful. Our platform helps individuals discover nonprofits that align with their values, interests, and level of involvement — whether that means donating, volunteering, or both.
              <br></br><br></br>Using intelligent filters and curated recommendations, we connect you with organizations that make a real difference, locally or globally. No endless searching, no uncertainty — just meaningful opportunities to do good.

            </p>
          </section>

          {/* Our Mission Section */}
          {/* This section now uses the 2-column layout class */}
          <section className="home-section--layout" style={{ marginTop: '2rem' }}>
            <div className="home-section__text">
              <h2>Our Mission</h2>
              <p style={{ textAlign: 'left' }}>
Our mission is to connect people with altruistic causes that inspire them to act.<br></br><br></br>
We aim to remove the barriers between those who want to help and the nonprofits that need their help — creating a world where everyone can contribute to positive change in a way that fits their passion, location, and lifestyle.              </p>
            </div>
            <div className="home-section__image">
              <img
                src="/Mission.png"
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
                src="/Story.jpg"
                alt="Our Story"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
            <div className="home-section__text">
              <h2>Our Story</h2>
              <p style={{ textAlign: 'left' }}>
The idea for NP Complete grew out of a simple frustration: finding the right nonprofit to support shouldn’t feel so complicated. As students and technologists, we realized that a recommender system — the same kind used to match people with movies or jobs — could be used for something far more meaningful: matching people with causes.
<br></br><br></br>
So, we built a platform that brings data and compassion together. By combining smart technology with human purpose, NP Complete empowers every user to turn good intentions into real-world impact.              </p>
            </div>
          </section>

          {/* Backend Message Button */}
          {/* Added a separator line for visual clarity */}
          {/* <div style={{ marginTop: '3rem', borderTop: '1px solid #e0e0e0', paddingTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={fetchMessage}
              className="submit-button"
            >
              Get Message from Backend
            </button>
            {message && (
              <p style={{ marginTop: "1rem", fontStyle: "italic" }}>{message}</p>
            )}
          </div> */}

        </div>
      </div>
    </div>
  );
}

export default Home;