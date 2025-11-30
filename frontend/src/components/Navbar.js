import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/discover', label: 'Discover' },
    { path: '/explore', label: 'Explore' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/npcompletelogo.png" alt="NP Complete Logo" className="nav-logo-img" />
          NPComplete
        </Link>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* <Link to="/signup">
            <button className="login-button" style={{ background: '#e0e0e0', color: '#282c34' }}>
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="login-button">
              Login
            </button>
          </Link> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
