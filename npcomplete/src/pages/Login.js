import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", minWidth: "320px" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>
  <form>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username" style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
            <input type="text" id="username" name="username" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
            <input type="password" id="password" name="password" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#61dafb", color: "#282c34", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            Login
          </button>
  {/* End of form and signup link */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.95rem" }}>No Account? </span>
          <Link to="/signup" style={{ color: "#1976d2", textDecoration: "underline", fontWeight: "bold" }}>Sign Up</Link>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
