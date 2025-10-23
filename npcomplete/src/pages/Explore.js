import React from 'react';
// 1. Import Auth.css instead of Explore.css
import './Auth.css'; 

// URLs for images related to non-profits
const nonprofitImages = {
  volunteersPacking: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  charityRun: 'https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  beachCleanup: 'https://www.marconews.com/gcdn/presto/2021/09/18/PTCN/299593ab-386d-41d4-bd8d-6f3018a0c512-TCN_COASTAL_CLEANUP07.jpg?width=660&height=440&fit=crop&format=pjpg&auto=webp',
  communityGarden: 'https://images.squarespace-cdn.com/content/v1/594a7ef737c5813e5d8a8f8d/1526415778843-K4Q2JKKVRAVROKSG3O8P/Scotts_Miracle_Main.jpg?format=2500w',
  foodDonation: 'https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  animalShelter: 'https://images.pexels.com/photos/220327/pexels-photo-220327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  donationJar: 'https://images.pexels.com/photos/6590699/pexels-photo-6590699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};

// Style object for background images to keep the JSX clean
const imageStyle = (imageUrl) => ({
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});


function Explore() {
  return (
    // 2. Use .auth-page as the main container, allowing scroll
    <div className="auth-page">
      
      {/* 3. Use a new wrapper class for centering the content */}
      <div className="explore-content-container">

        {/* 4. Re-style search bar using .form-row */}
        <div className="form-row" style={{ width: '70%', margin: '2rem auto 2.5rem auto' }}>
          {/* 5. Add .search-input class for the icon */}
          <input type="text" placeholder="Search" className="search-input" />
        </div>

        {/* 6. Use new .explore-grid class */}
        <div className="explore-grid">
          {/* 7. Use new .explore-box class (and removed wavy lines) */}
          <div className="explore-box pink" style={imageStyle(nonprofitImages.volunteersPacking)}>
          </div>
          <div className="explore-box red" style={imageStyle(nonprofitImages.charityRun)}>
          </div>
          <div className="explore-box large-green" style={imageStyle(nonprofitImages.beachCleanup)}>
          </div>

          <div className="explore-box light-green" style={imageStyle(nonprofitImages.communityGarden)}>
          </div>
          <div className="explore-box purple" style={imageStyle(nonprofitImages.foodDonation)}>
          </div>

          <div className="explore-box light-gray" style={imageStyle(nonprofitImages.animalShelter)}>
          </div>
          <div className="explore-box light-blue" style={imageStyle(nonprofitImages.donationJar)}>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;