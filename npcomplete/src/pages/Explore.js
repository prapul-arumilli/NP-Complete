import React from 'react';
import './Explore.css'; // Import the CSS file

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
    <div className="explore-page">
      {/* Search Bar */}
      <div className="search-bar-container">
        <input type="text" placeholder="Search" className="search-bar" />
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Row 1 */}
        <div className="content-box pink" style={imageStyle(nonprofitImages.volunteersPacking)}>
          <div className="wavy-line"></div>
        </div>
        <div className="content-box red" style={imageStyle(nonprofitImages.charityRun)}>
          <div className="wavy-line"></div>
        </div>
        <div className="content-box large-green" style={imageStyle(nonprofitImages.beachCleanup)}>
          <div className="wavy-line"></div>
        </div>

        {/* Row 2 */}
        <div className="content-box light-green" style={imageStyle(nonprofitImages.communityGarden)}>
          <div className="wavy-line"></div>
        </div>
        <div className="content-box purple" style={imageStyle(nonprofitImages.foodDonation)}>
          <div className="wavy-line"></div>
        </div>
        {/* The large green box spans 2 rows */}

        {/* Row 3 */}
        <div className="content-box light-gray" style={imageStyle(nonprofitImages.animalShelter)}>
          <div className="wavy-line"></div>
        </div>
        <div className="content-box light-blue" style={imageStyle(nonprofitImages.donationJar)}>
          <div className="wavy-line"></div>
        </div>
      </div>
    </div>
  );
}

export default Explore;