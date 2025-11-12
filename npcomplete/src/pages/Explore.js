import React, { useState } from 'react'; // 1. Import useState
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
  // 2. Add state to hold the search query and the results
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]); // Holds search results from backend
  const [isLoading, setIsLoading] = useState(false); // For loading spinner/message
  const [error, setError] = useState(null);       // For error messages

  /**
   * 3. This function is called when the user submits the search form.
   */
  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Prevents the page from reloading
    
    // Don't search if the query is empty
    if (searchQuery.trim() === '') {
      setResults([]); // Clear any previous results
      return;
    }

    setIsLoading(true); // Show loading state
    setError(null);     // Clear previous errors

    try {
      // ---
      // ⭐️ 1. This is the backend API endpoint.
      // Replace '/api/search' with the actual route.
      // ---
      const endpoint = `/api/search?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // ---
      // ⭐️ 2. Depends on the backend's JSON response.
      // If backend sends back an array: setResults(data)
      // If it sends { results: [...] }:   setResults(data.results)
      // ---
      setResults(data);

    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Failed to load results. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className="auth-page">
      <div className="explore-content-container">

        {/* 4. The search bar is now a <form> to handle 'Enter' key submission */}
        <form 
          className="form-row" 
          style={{ width: '70%', margin: '2rem auto 2.5rem auto' }}
          onSubmit={handleSearchSubmit} 
        >
          {/* 5. The input is now "controlled" by React state */}
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* 6. Conditionally render loading, error, results, or default grid */}
        
        {/* --- LOADING STATE --- */}
        {isLoading && <p style={{ textAlign: 'center' }}>Loading results...</p>}

        {/* --- ERROR STATE --- */}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {/* --- RESULTS STATE (Show results if they exist) --- */}
        {!isLoading && !error && results.length > 0 && (
          <div className="explore-grid"> {/* Use the same grid */}
            {/* ⭐️ 3. Map over your 'results' array.
              Change 'result.id', 'result.name', and 'result.imageUrl'
              to match the field names from your backend database.
            */}
            {results.map(result => (
              <div 
                key={result.id} // ⭐️ Use a unique key, like 'result.id' or 'result.nonprofit_id'
                className="explore-box"
                style={imageStyle(result.imageUrl)} // ⭐️ Use the image field, e.g., 'result.image_url'
              >
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div className="explore-grid">
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
        )}

      </div>
    </div>
  );
}

export default Explore;