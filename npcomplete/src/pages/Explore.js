import React from 'react';
import './Explore.css'; // Import the CSS file

function Explore() {
  return (
    <div className="explore-page">
      {/* Search Bar */}
      <div className="search-bar-container">
        <input type="text" placeholder="Search" className="search-bar" />
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Row 1 */}
        <div className="content-box pink">
          <div className="wavy-line"></div>
        </div>
        <div className="content-box red">
          <div className="wavy-line"></div>
        </div>
        <div className="content-box large-green">
          <div className="wavy-line"></div>
        </div>

        {/* Row 2 */}
        <div className="content-box light-green">
          <div className="wavy-line"></div>
        </div>
        <div className="content-box purple">
          <div className="wavy-line"></div>
        </div>
        {/* The large green box spans 2 rows */}

        {/* Row 3 */}
        <div className="content-box light-gray">
          <div className="wavy-line"></div>
        </div>
        <div className="content-box light-blue">
          <div className="wavy-line"></div>
        </div>
      </div>
    </div>
  );
}

export default Explore;