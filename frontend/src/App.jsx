import { useState, useEffect } from 'react';
import { checkHealth, getWeather } from '../services/api.js';
import { validatCityInput, formatCityName, getInputSuggestion } from './utils/validation.js';
import { 
  addToSearchHistory, 
  clearSearchHistory, 
  getSearchHistory, 
  removeFromSearchHistory
} from './utils/searchHistory.js';
import { getCachedWeather, setCachedWeather} from './utils/cache.js';
import { validateWeatherData } from './utils/defensive.js';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import SearchHistory from './components/SearchHistory.jsx';
import CacheIndicator from './components/CacheIndicator.jsx';
import CacheManager from './components/CacheManager.jsx';
import WeatherDisplay from './components/WeatherDisplay.jsx';
import './App.css'



function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [inputSuggestion, setInputSuggestion] = useState(null);

  const [searchHistory, setSearchHistory] = useState([]);

  const [cacheInfo, setCacheInfo] = useState(null);
  

  // Load Search History.
  useEffect(() => {
    const history = getSearchHistory();
    setSearchHistory(history);
    console.log(`[APP] Loaded Search History:`, history.length, ' items');
  }, []);


  // Check Backend Health
  useEffect(() => {
    const checkBackendHealth = async () => {
      console.log(`[APP] Checking Backend Health...`);
      const result = await checkHealth();
      setHealthStatus(result);
      setHealthLoading(false);
    }

    checkBackendHealth();
  }, []);


 
  // Validate Input as Users Types
  useEffect(() => {
    if (cityInput.trim() === '') {
        setValidationError(null);
        setInputSuggestion(null);
        return;
    }


    const timeoutId = setTimeout(() => {
      const validation = validatCityInput(cityInput);


      if (!validation.isValid) {
        setValidationError(validation.error);
      } else {
        setValidationError(null);
      }


      const suggestion = getInputSuggestion(cityInput);
      setInputSuggestion(suggestion);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [cityInput]);


  // Handle Input Change - resets search to new searched value
  const handleInputChange = (e) => {
    setCityInput(e.target.value);

    if (weatherError) {
      setWeatherData(null);
    }
  };

  // Perform Weather Search
  const performSearch = async (city, forceRefresh = false) => {
    const validation = validatCityInput(city);
    
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    const sanitizedCity = validation.sanitized;
    console.log('[APP] Searching for city:', sanitizedCity, forceRefresh ? '(forced refresh)' : '');

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = getCachedWeather(sanitizedCity);
      if (cached) {
        console.log('[APP] Using cached data for:', sanitizedCity);
        
        // Validate cached data
        const validation = validateWeatherData(cached.data);
        if (!validation.isValid) {
          console.error('[APP] Cached data is invalid, fetching fresh data');
          // Don't use invalid cached data, fetch fresh
        } else {
          setWeatherData(cached.data);
          setCacheInfo({ fromCache: true, age: cached.age });
          setCityInput(formatCityName(sanitizedCity));
          setWeatherError(null);
          setValidationError(null);
          setInputSuggestion(null);
          
          const updatedHistory = addToSearchHistory(sanitizedCity, cached.data);
          setSearchHistory(updatedHistory);
          return;
        }
      }
    }

    // Fetch fresh data
    setWeatherLoading(true);
    setWeatherError(null);
    setWeatherData(null);
    setValidationError(null);
    setInputSuggestion(null);
    setCacheInfo(null);

    const result = await getWeather(sanitizedCity);

    setWeatherLoading(false);

    if (result.success) {
      console.log('[APP] Weather data received:', result.data);
      
      // Validate received data
      const validation = validateWeatherData(result.data);
      if (!validation.isValid) {
        console.error('[APP] Received invalid data from API');
        setWeatherError({
          message: 'Received invalid data from server',
          errors: validation.errors
        });
        return;
      }
      
      if (validation.warnings.length > 0) {
        console.warn('[APP] Data has warnings but is usable');
      }
      
      setWeatherData(result.data);
      setCacheInfo({ fromCache: false, age: 0 });
      setCityInput(formatCityName(sanitizedCity));
      
      setCachedWeather(sanitizedCity, result.data);
      
      const updatedHistory = addToSearchHistory(sanitizedCity, result.data);
      setSearchHistory(updatedHistory);
    } else {
      console.error('[APP] Weather error:', result.error);
      setWeatherError(result.error);
      setCacheInfo(null);
    }
  };
      
  // Handle Search Click. 
  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(cityInput, false);
  };

  // handle refresh
  const handleRefresh = async () => {
    if (weatherData && weatherData.current) {
      const city = weatherData.current.name;
      console.log(`[APP] Refreshing Data for:`, city)
      await performSearch(city, true)
    }
  }

  
   // Handle History Search Selection
  const handleHistorySelect = async (city) => {
    console.log(`[APP] Selected from history`, city);
    setCityInput(city);
    await performSearch(city, false);
  };

  // Handle Remove From History (individual)
  const handleRemoveFromHistory = (city) => {
    console.log(`[APP] removing from history`, city);
    const updatedHistory = removeFromSearchHistory(city);
    setSearchHistory(updatedHistory);
  };



  // Handle Clear Search History (entirely)
  const handleClearHistory = ()  => {
    console.log(`[APP] Clearing All History `);
    if (window.confirm("Are you sure you want to clear all your history?")) {
      const updatedHistory = clearSearchHistory();
      setSearchHistory(updatedHistory);
    }
  }

  // Handle Input Clear Button Click
  const handleClear = () => {
    setCityInput('');
    setWeatherData(null);
    setWeatherError(null);
    setValidationError(null);
    setInputSuggestion(null);
  };

  // Handle Suggestiuon Button Click
  const handleSuggestionClick = () => {
    if (inputSuggestion?.suggestion) {
      setCityInput(inputSuggestion.suggestion);
      setInputSuggestion(null);
    }
  };


 

  return (
    <div className="app">
      <LoadingSpinner
        show={weatherLoading}
        message='Fetching Weather Data'
        overlay={true}
      />


      <header className="app-header">
        <h2>Weather Dashboard</h2>
        <p>Phase 5 : Weather UI Logic Complete</p>
      </header>
      <section>
        <h2>Backend Status</h2>
        {healthLoading ? (
          <LoadingSpinner show={true} message='Checking Backend...' />
        ) : healthStatus.success ? (
          <div className="health-success">
          <p>Backend Connected</p>
          <details>
            <summary>View Details</summary>
            <pre>{JSON.stringify(healthStatus.data, null, 0 )}</pre>
          </details>
          </div>
        ) : (
          <div className="health-error"> 
            <p>Backend Connection Failed</p>
            <pre>{JSON.stringify(healthStatus.error, null, 2)}</pre>
            <p className="help-text">
              Make Sure backend is runnign: <code>cd backed && npm run dev</code>
            </p>
          </div>
        )}
      </section>
        
      



      <section className="weather-section">
        <h2>Weather Section</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <input 
              id='city-search'
              type="text"
              value={cityInput}
              onChange={handleInputChange}
              placeholder='Enter City Name (e.g Tokyo, London)'
              className={`search-input ${validationError ? 'input-error' : ''}`}
              disabled={weatherLoading}
              autoFocus
            />
            {cityInput && (
              <button
                type="button"
                onClick={handleClear}
                className="clear-button"
                disabled={weatherLoading}
                title='clear Input'
              >
                X
              </button>
            )}
          </div>

          {validationError && (
            <div className="validation-error">
               {validationError}
            </div>
          )}


          {inputSuggestion?.suggestion && (
            <div className="input-suggestion">
              <span>{inputSuggestion.reason}</span>
              <button
                type="button"
                onClick={handleSuggestionClick}
                className="suggestion-button"
              >
                {inputSuggestion.suggestion}
              </button>
            </div>
          )}



          <div className="button-group">
            <button
              type="submit"
              className="btn-primary"
              disabled={weatherLoading || !healthStatus?.success || validationError !== null}
            >
              {weatherLoading ? (
                <span className="button-content">
                  <span className="button-spinner"></span>
                  Searching
                </span>
              ) : (
                'Search'
              )}
            </button>


            {(weatherData || weatherError) && (
              <button 
                type="button"
                onClick={handleClear}
                className="btn-secondary"
                disabled={weatherLoading}
              >
                Clear Results
              </button>
            )}
          </div>
        </form>

        <SearchHistory 
          history={searchHistory}
          onSelectCity={handleHistorySelect}
          onRemoveCity={handleRemoveFromHistory}
          onClearHistory={handleClearHistory}
        />



        <CacheManager/>


        {weatherError && (
          <div className="weather-error">
            <h3>Error</h3>
            <p>{weatherError.message || weatherError.error}</p>
            {weatherError.city && <p>City: {weatherError.city}</p>}
            {weatherError.error && (
              <div className="error-details"> 
                <p><b>Details:</b></p>
                <ul>
                  {weatherError.message.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}


        {weatherData && (
          <>
            {cacheInfo && (
              <CacheIndicator
                fromCache={cacheInfo.fromCache}
                age={cacheInfo.age}
                onRefresh={handleRefresh}
              />
            )}





            <WeatherDisplay weatherData={weatherData}  />
          </>
        )}
      </section>


      <section className="instructions">
        <h2>Phase 5 - Feature 5: Defensive Rendering</h2>
        <h3>Testing Instructions</h3>
        <ol>
          <li><strong>Normal data:</strong> Search "London"  All data displays correctly</li>
          <li><strong>Missing data:</strong> Simulate missing fields  Shows "N/A" fallbacks</li>
          <li><strong>Cache refresh:</strong> Click refresh  Shows loading spinner in button</li>
          <li><strong>Cache manager loading:</strong> Clear all cache  Shows loading spinner</li>
          <li><strong>Invalid data:</strong> Corrupted cache Fetches fresh data automatically</li>
          <li><strong>Weather icons:</strong> If icon fails to load  Gracefully hidden</li>
          <li><strong>Empty forecast:</strong> No forecast data  Shows "No forecast data available"</li>
          <li><strong>Data validation:</strong> Check console for validation warnings</li>
          <li><strong>Null safety:</strong> All fields handle null/undefined gracefully</li>
          <li><strong>Array validation:</strong> Empty or invalid arrays  Safe fallbacks</li>
        </ol>
        
        <h3>New Features</h3>
        <ul>
          <li> Defensive data access with safeGet()</li>
          <li> Weather data validation on receive and cache load</li>
          <li> "N/A" fallbacks for all missing data</li>
          <li> Temperature, wind, humidity formatters with validation</li>
          <li> Weather icon fallback (emoji if image fails)</li>
          <li> Array validation and sanitization</li>
          <li> Cache refresh shows inline loading spinner</li>
          <li>Cache manager clear shows loading state</li>
          <li> Separate WeatherDisplay component</li>
          <li> Error boundaries for invalid data</li>
          <li> Console warnings for missing/invalid fields</li>
          <li> Image error handling (onError events)</li>
        </ul>

        <h3>Defensive Rendering Features</h3>
        <ul>
          <li> Never crashes on missing data</li>
          <li> Never shows "undefined" or "null" in UI</li>
          <li> Validates all API responses</li>
          <li> Validates all cached data before use</li>
          <li> Graceful fallbacks for all edge cases</li>
          <li> Loading states for all async operations</li>
          <li> Handles malformed API responses</li>
          <li> Handles network failures</li>
          <li> Image load error handling</li>
          <li> Array bounds checking</li>
        </ul>

        <h3>Phase 5 Complete - All Features</h3>
        <ol>
          <li> Input Validation & Sanitization</li>
          <li> Enhanced Loading States with Spinner</li>
          <li> Search History with localStorage</li>
          <li> Response Caching (10-minute TTL)</li>
          <li> Defensive Rendering</li>
        </ol>

        <h3>Ready for Phase 6: Visualization</h3>
        <p>Next phase will add:</p>
        <ul>
          <li> Chart.js temperature graphs</li>
          <li> Leaflet interactive map</li>
          <li> Weather icons and visual polish</li>
          <li> Responsive design improvements</li>
        </ul>
      </section>
    </div>
  )
};

export default App;
