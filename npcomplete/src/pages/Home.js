import React, { useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  const fetchMessage = () => {
    fetch("http://127.0.0.1:5000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching message"));
  };

  return (
    <div className="page-container" style={{ fontFamily: "sans-serif" }}>
      {/* About Us Section */}
      <section
        style={{
          height: "100vh",
          position: "relative",
          backgroundImage: "url('/about-bg.jpg')", // replace with your image
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        {/* Overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", // dark transparent overlay
          }}
        />

        {/* Text on top */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
            About Us
          </h1>
          <p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
            Big facts go here — About Us section
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4rem",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ flex: 1, paddingRight: "2rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Our Mission
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Our mission is to push the boundaries of computational thinking,
            problem-solving, and technology innovation to create impactful
            solutions.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <img
            src="/mission.jpg"
            alt="Our Mission"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4rem",
          backgroundColor: "#e9ecef",
          minHeight: "100vh",
        }}
      >
        <div style={{ flex: 1 }}>
          <img
            src="/story.jpg"
            alt="Our Story"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
        <div style={{ flex: 1, paddingLeft: "2rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Our Story</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Our story began with a vision — to transform abstract computer
            science problems into real-world solutions. From small beginnings,
            we grew into a community passionate about innovation.
          </p>
        </div>
      </section>

      {/* Backend Message Button */}
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <button
          onClick={fetchMessage}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#61dafb",
            color: "#282c34",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Get Message from Backend
        </button>
        {message && (
          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default Home;
