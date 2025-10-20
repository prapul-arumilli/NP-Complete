import React from "react";

function Signup() {
  return (
    <div className="signup-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", minWidth: "320px" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Sign Up</h2>
        <form>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username" style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
            <input type="text" id="username" name="username" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
            <input type="email" id="email" name="email" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
            <input type="password" id="password" name="password" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#61dafb", color: "#282c34", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
