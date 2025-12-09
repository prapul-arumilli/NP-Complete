import React, { useState, useEffect } from 'react';
import './Auth.css';

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);       
  const [from, setFrom] = useState(0); 
  const [hasMore, setHasMore] = useState(false);
  const [city, setCity] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [zip, setZip] = useState('');

  const INITIAL_RESULTS = 20; // first batch
  const LOAD_MORE_COUNT = 10; // per click

  // Core fetch function
  const fetchResults = async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = 'http://127.0.0.1:5000/api/search';

      // Decide offset and size
      const currentFrom = reset ? 0 : from;
      const size = reset ? INITIAL_RESULTS : LOAD_MORE_COUNT;

      // ✅ FIXED: Always send same structure; "*" means match all
      const body = {
      query: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: searchQuery.trim() === '' ? '*' : searchQuery,
                  fields: [
                    "NAME",
                    "NTEE_DESCRIPTION",
                    "NTEE_KEYWORDS",
                    "NTEE_TITLE"
                  ]
                }
              }
            ],
            filter: [
              ...(city ? [{ match: { CITY: city } }] : []),
              ...(stateFilter ? [{ match: { STATE: stateFilter } }] : []),
              ...(zip ? [{ match: { ZIP: zip } }] : [])
            ]
          }
        }
      },
      from: currentFrom,
      size: size
    };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const hits = Array.isArray(data) ? data : data.hits || [];

      setResults(reset ? hits : [...results, ...hits]);
      setHasMore(hits.length > 0);
      setFrom(currentFrom + hits.length);
    } catch (err) {
      console.error('Failed to fetch search results:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch default results on page load
  useEffect(() => {
    fetchResults(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setFrom(0);
    fetchResults(true);
  };

  const handleLoadMore = () => {
    fetchResults(false);
  };

  // Surprise Me - fetch a random nonprofit
  const handleSurpriseMe = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get a random offset (assuming ~1000 docs)
      const randomOffset = Math.floor(Math.random() * 900);
      
      const body = {
        query: { query: { match_all: {} } },
        from: randomOffset,
        size: 1
      };

      const response = await fetch('http://127.0.0.1:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const hits = Array.isArray(data) ? data : data.hits || [];
      
      if (hits.length > 0) {
        setResults(hits);
        setHasMore(false);
        setFrom(1);
      }
    } catch (err) {
      setError('Failed to get random nonprofit. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate external links
  const getProPublicaLink = (ein) => {
    const cleanEin = ein?.replace(/-/g, '') || '';
    return `https://projects.propublica.org/nonprofits/organizations/${cleanEin}`;
  };

  const getGoogleSearchLink = (name, city, state) => {
    const query = encodeURIComponent(`${name} ${city} ${state} nonprofit`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="auth-page">
      <div className="explore-content-container">

        {/* Search bar */}
        <form 
          className="form-row horizontal-filters" 
          style={{ 
            width: '70%', 
            margin: '2rem auto 2.5rem auto',
            display: 'flex',      
            gap: '0.5rem',        
            alignItems: 'center', 
          }}
          onSubmit={handleSearchSubmit} 
        >
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
            style={{ flexGrow: 2, flexBasis: 0, minWidth: 0 }}
          />
          
          <input 
            type="text"
            placeholder="City"
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
            style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
          />

          <input 
            type="text"
            placeholder="State"
            className="search-input"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
            style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
          />

          <input 
            type="text"
            placeholder="ZIP"
            className="search-input"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
            style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
          />
          
          <button
            type="button"
            onClick={handleSurpriseMe}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Surprise Me
          </button>
        </form>



        {/* Loading state */}
        {isLoading && <p style={{ textAlign: 'center' }}>Loading results...</p>}

        {/* Error state */}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <>
            <div 
              className="explore-grid"
              style={{
                marginTop: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                width: '100%',
                padding: '0 1rem',
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
                      width: '100%',
                      maxWidth: '1000px',
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

                    {/* External Links */}
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem' }}>
                      {src.EIN && (
                        <a
                          href={getProPublicaLink(src.EIN)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#6b7280',
                            fontSize: '0.85rem',
                            textDecoration: 'underline',
                          }}
                        >
                          View on ProPublica
                        </a>
                      )}
                      <a
                        href={getGoogleSearchLink(src.NAME, src.CITY, src.STATE)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#6b7280',
                          fontSize: '0.85rem',
                          textDecoration: 'underline',
                        }}
                      >
                        Search Google
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && !isLoading && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  onClick={handleLoadMore}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {!isLoading && !error && results.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280' }}>
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Explore;
