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
import WeatherMap from './components/WeatherMapData.jsx';
import './App.css'
import 'leaflet/dist/leaflet.css';




function App() {
  // States
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

    // 300ms Debounce for validation and suggestion.
    const timeoutId = setTimeout(() => {
      const validation = validatCityInput(cityInput);

      // validate
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
    // validate
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }
    // Sanitization
    const sanitizedCity = validation.sanitized;
    console.log('[APP] Searching for city:', sanitizedCity, forceRefresh ? '(forced refresh)' : '');

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      // get getcachedweather
      const cached = getCachedWeather(sanitizedCity);
      // if is present use data
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

          // set new updated history
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
    // await getWeather of saniziedCityinput
    const result = await getWeather(sanitizedCity);

    setWeatherLoading(false);
    // if successs
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
      // Check warnings 
      if (validation.warnings.length > 0) {
        console.warn('[APP] Data has warnings but is usable');
      }
      // set data
      setWeatherData(result.data);
      setCacheInfo({ fromCache: false, age: 0 });
      setCityInput(formatCityName(sanitizedCity));
      setCachedWeather(sanitizedCity, result.data);
      // update Histroy
      const updatedHistory = addToSearchHistory(sanitizedCity, result.data);
      setSearchHistory(updatedHistory);
    } else {
      // Catch errors
      console.error('[APP] Weather error:', result.error);
      setWeatherError(result.error);
      setCacheInfo(null);
    }
  };
      
  // Handle Search Click. 
  const handleSearch = async (e) => {
    // prevent default action
    e.preventDefault();
    // await performsearch
    await performSearch(cityInput, false);
  };

  // handle refresh
  const handleRefresh = async () => {
    // check if weatherData and current is present
    if (weatherData && weatherData.current) {
      // get city name from weatherData
      const city = weatherData.current.name;
      console.log(`[APP] Refreshing Data for:`, city)
      // perform search on that city
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
    // Window Confirmation
    if (window.confirm("Are you sure you want to clear all your history?")) {
      const updatedHistory = clearSearchHistory();
      setSearchHistory(updatedHistory);
    }
  }

  // Handle Input Clear Button Click
  const handleClear = () => {
    // Clear input 
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
  <div className="app-container">
    <LoadingSpinner
      show={weatherLoading}
      message='Fetching Weather Data'
      overlay={true}
    />



    {/* Header */}
    <header className="app-header">
        <h2>Weather Dashboard</h2>
        <p>Phase 6 : Leaflet Visualization with dynamic UI for mobiles</p>
      </header>
      <section className="health">
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


    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3>System Status</h3>
          {healthLoading ? (
            <LoadingSpinner show={true} message="Checking..."/>
          ) : (
            <div className={`status ${healthStatus.success ? 'online': 'offline'}`}>
              {healthStatus.success ? 'Backend Online' : 'Backend Offline'}
            </div>
          )}  
          

          <details className="status-details">
            <summary>Connection Specs</summary>
            <pre>{JSON.stringify(healthStatus?.data, null,  2)}</pre>
          </details>
        </div> 



        <div className="sidebar-section">
          <h3>Data Management</h3>
          <CacheManager />
          
        </div>
      </aside>


      <main className="content-area">
        <section className="search-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <input
              id="city-search" 
              type="text"
              value={cityInput}
              onChange={handleInputChange}
              placeholder='Search City (e.g Tokyo, London)'
              className={validationError ? 'input-error' : ''}
              disabled={weatherLoading}
              />
              {cityInput && (
                <button type="button" onClick={handleClear} className="btn-clear">X</button>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={weatherLoading || !healthStatus?.success || validationError !== null }
                >
                  {weatherLoading ? <span className="spinner-small"></span> : 'Search'}
              </button>
            </div>

            {validationError && <p className="error-text">{validationError}</p>}



            {inputSuggestion?.suggestion && (
              <div className="suggestion-box">
                {inputSuggestion.reason}
                <button type="button" onClick={handleSuggestionClick}>
                  {inputSuggestion.suggestion}
                </button>
              </div>
            )}
          </form>
        </section>



        <div className="dashboard-grid">
          <div className="primary-column">
            {weatherData && (
              <div className="map-card">
                <WeatherMap weatherData={weatherData}/>
              </div>
            )}



            {weatherError && (
              <div className="error-card">
                <h4>Search Error</h4>
                <p>{weatherError.message}</p>
              </div>
            )}


            {weatherData && (
              <div className="results-card"> 
                <CacheIndicator
                  fromCache={cacheInfo?.fromCache}
                  age={cacheInfo?.age}
                  onRefresh={handleRefresh}
                />
                
                <WeatherDisplay weatherData={weatherData} />
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="secondary-column">
           <SearchHistory
              history={searchHistory}
              onSelectCity={handleHistorySelect}
              onRemoveCity={handleRemoveFromHistory}
              onClearHistory={handleClearHistory}
            />
        </div>
    </div>
  </div>
)};

export default App;
