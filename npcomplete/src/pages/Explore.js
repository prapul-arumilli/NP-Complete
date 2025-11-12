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
    event.preventDefault();

    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // --- 1. Flask is running on port 5000 ---
      // If your React dev server runs on port 3000, make sure to include the full URL
      const endpoint = 'http://127.0.0.1:5000/api/search';

      // --- 2. Build the POST body to match Flask's expected input ---
      const body = {
        query: {
          query: {
            query_string: {
              query: searchQuery
            }
          }
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // --- 3. Adjust based on backend structure ---
      // If your Flask returns a dict like { "hits": [...] }:
      // setResults(data.hits)
      // If it returns an array directly:
      setResults(data);

    } catch (err) {
      console.error('Failed to fetch search results:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div 
            className="explore-grid"
            style={{
              marginTop: '4rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',   // center wide cards if maxWidth < 100%
              gap: '1.5rem',
              width: '100%',
              padding: '0 1rem',      // small page padding
            }}
          >
            {results.map((result) => {
              const src = result._source || {};
              return (
                <div 
                  key={result._id}
                  className="explore-card"
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '1.25rem 2rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    width: '100%',           // full width of container
                    maxWidth: '1000px',      // optional: keeps cards readable on very wide screens
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#111827' }}>
                    {src.NAME || 'Unnamed Nonprofit'}
                  </h3>

                  <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                    {src.CITY && src.STATE ? `${src.CITY}, ${src.STATE}` : 'Location Unknown'}
                  </p>

                  <p style={{ margin: '0.25rem 0', color: '#2563eb', fontSize: '0.9rem', fontWeight: 500 }}>
                    {src.NTEE_TITLE || 'No Category'}
                  </p>

                  <p
                    style={{
                      marginTop: '0.75rem',
                      color: '#374151',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                    }}
                  >
                    {src.NTEE_DESCRIPTION || 'No description available.'}
                  </p>
                </div>
              );
            })}
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