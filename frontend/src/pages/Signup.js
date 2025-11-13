// ...existing code...
import './Auth.css';

export default function Signup() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create account</h1>
          <p>Join us — it’s free</p>
          <div className="form-row">
            <label>Name</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" />
          </div>
          <button className="submit-button">Sign up</button>
          <div className="auth-help">
            <a href="/login">Already have an account?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
// ...existing code...