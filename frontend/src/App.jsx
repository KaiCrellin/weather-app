import { useState, useEffect } from 'react';
import { checkHealth, getWeather } from '../services/api.js';
import { validatCityInput, formatCityName, getInputSuggestion } from './utils/validation.js';
import { 
  addToSearchHistory, 
  clearSearchHistory, 
  getSearchHistory, 
  removeFromSearchHistory
} from './utils/searchHistory.js';
import { getAllCachedCities, getCachedWeather, setCachedWeather} from './utils/cache.js';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import SearchHistory from './components/SearchHistory.jsx';
import CacheIndicator from './components/CacheIndicator.jsx';
import CacheManager from './components/CacheManager.jsx';
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
  const [cachedCities, setCachedCities] = useState(getAllCachedCities());

  

  const refreshCacheList = () => setCachedCities(getAllCachedCities())

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
    console.log(`[APP] Searching for City:`, sanitizedCity, forceRefresh? '(forced refresh)' : '');


    if (!forceRefresh) {
      const cached = getCachedWeather(sanitizedCity);
      if (cached) {
        console.log(`[APP] using Cached Data For`, sanitizedCity);
        setWeatherData(cached.data);
        setCacheInfo({ fromCache: true, age: cached.age});
        setCityInput(formatCityName(sanitizedCity));
        setWeatherError(null);
        setValidationError(null);
        setInputSuggestion(null);


        const updatedHistory = addToSearchHistory(sanitizedCity, cached.data);
        setSearchHistory(updatedHistory);
        return;
      }
    }

    setWeatherLoading(true);
    setWeatherError(null);
    setWeatherData(null);
    setValidationError(null);
    setInputSuggestion(null);
    setCacheInfo(null);

    const result = await getWeather(sanitizedCity);

    setWeatherLoading(false);

    if (result.success) {
        console.log(`[APP] Weather Data Recieved`, result.data);
        setWeatherData(result.data);
        setCacheInfo({fromCache: false, age: 0})
        setCityInput(formatCityName(sanitizedCity));
        setCachedWeather(sanitizedCity, result.data);
        refreshCacheList();
      

        const updatedHistory = addToSearchHistory(sanitizedCity, result.data);
        setSearchHistory(updatedHistory);
      } else {
        console.error(`[APP] Weather Error`, result.error);
        setWeatherError(result.error);
        setCacheInfo(null);
    }
      
  };
  // Handle Search Click. 
  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(cityInput, false);
    setWeatherLoading(false);
  };

  
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
        message='Fetching Weather Data...'
        overlay={true}
      />

      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p>Phase 5: Weather UI - Feature 3</p>
      </header>


       <section className="health-section">
        <h2>Backend Status</h2>
        {healthLoading ? (
          <LoadingSpinner show={true} message='Checking Backend' />
        ) : healthStatus.success ? (
          <div className="health-success">
            <p> Backend connected</p>
            <details>
              <summary>View Details</summary>
              <pre>{JSON.stringify(healthStatus.data, null, 2)}</pre>
            </details>
          </div>
        ) : (
          <div className="health-error">
            <p> Backend connection failed</p>
            <pre>{JSON.stringify(healthStatus.error, null, 2)}</pre>
            <p className="help-text">
              Make sure backend is running: <code>cd backend && npm run dev</code>
            </p>
          </div>
        )}
      </section>

      <section className='instructions'>
        <h2>Testing Instructions</h2>
        <ol>
          <li><b>Searching:</b> Each City Search will be present in history
          Parsing the most recent search to the top of the list </li>
          <li><b>Click history Item</b>Cities can be researched by history item</li>
          <li><b>Remove Item and Clear all</b>Entiers can be deleted individually or entirely</li>
          <li><b>Persistance</b>Refreashing keeps history visible</li>
          <li><b>Duplicate search</b>Should not update history</li>
          <li><b>Max Items</b> Only Ten History Items can be held in storage at once</li>
          <li><b>Relative Times</b> Searched items include a timestamp ('just now, x Minutes ago, etc.)</li>
        </ol>
        <h2>New Features</h2>
        <ol>
          <li> LocalStorage SearchHistory</li>
          <li> Max 10 History Items</li>
          <li> Cities can be researched by history item</li>
          <li> Remove individual history city entires</li>
          <li> Clear all cities with window confirmation</li>
          <li>  Show temp and weather conditions of previous searches</li>
          <li> Relative Timestamps (just Now, 5 Minutes Ago, 2 Hours Ago)</li>
          <li> duplicate history prevention</li>
          <li> Will persist if broswer sessions change</li>
          <li> Emply State Message to promt users</li>
        </ol>
        <h2>Cache Behaviour</h2>
        <ol>
          <li> First Search - API Call - Cahce Stored</li>
          <li> Repeat Search (within 10m) - Cache Used - No API call</li>
          <li> Click Refresh - API Call - Cache Updated</li>
          <li> After 10m - cache expires - next search calls API</li>
          <li> History Click - Uses Cache if available</li>
        </ol>
      </section>


      <section className="weather-section">
        <h2>Weather Search</h2>
        {cacheInfo && (
              <CacheIndicator
              fromCache={cacheInfo.fromCache}
              age={cacheInfo.age}
              onRefresh={() => performSearch(cityInput, true)}
              />
            )}
        <form  onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <input
            name='search-form'
            type="text"
            value={cityInput}
            onChange={handleInputChange}
            placeholder="Enter City Name (e.g. London Tokyo)"
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
                title="clear input"
              >
                X
              </button>
            )}
          </div>


          {validationError && (
            <div className="validation-error">
              {validationError ?? 'No Value'}
            </div>
          )}



          {inputSuggestion?.suggestion && (
            <div className="input-suggestion">
              <span>{inputSuggestion.reason ?? 'No Value'}</span>
              <button 
                type="button"
                onClick={handleSuggestionClick}
                className="suggestion-button"
                >
                  {inputSuggestion.suggestion ?? 'No Value'}
                </button>
            </div>
          )}

          


          <div className="button-group">
            <button
            type="submit"
            className="btn-primary"
            disabled={weatherLoading  || !healthStatus?.success || validationError !== null}
            >
             {weatherLoading ? (
              <span className="button-content">
                <span className="button-spinner"></span>
                Searching...
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
              disabled={weatherLoading}>
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

        <CacheManager  cities={cachedCities} onUpdate={refreshCacheList}/>



        {weatherError && (
          <div className="weather-error">
            <h3>Error</h3>
            <p>{weatherError.message || weatherError.error} </p>
            {weatherError.city && <p>{weatherError.city}</p>}
          </div>
        )}


        {weatherData && (
          <div className="weather-results">


            <h3>Results for {weatherData.current.name ?? 'No Value'}</h3>

            <div className="current-weather">
              <h2>Current Weather</h2>
              <div className="weather-data">
                <p><b>Temperature:</b> {weatherData.current?.main.temp ?? 'No Value -'}C</p>
                <p><b>Feels Like:</b> {weatherData.current?.main.feels_like ?? 'No Value -'}C</p>
                <p><b>Condition:</b> {weatherData.current?.weather[0].main ?? 'No Value'}</p>
                <p><b>Description:</b> {weatherData.current?.weather[0].description ?? 'No Value'}</p>
                <p><b>Humidiity:</b> {weatherData.current?.main.humidity ?? 'No Value -'}%</p>
                <p><b>Wind Speed</b> {weatherData.current?.wind.speed ?? 'No Value -'}m/s</p>
                <p><b>Country</b> {weatherData.current?.sys.country ?? 'No Value'}</p>
              </div>
            </div>

            <div className="forecast-preview">
              <h2>Forecast Preview</h2>
              <div className="forecast-sample">
                <h3>First 3 Entries:</h3>
                {weatherData.forecast.list.slice(0,3).map((entry, index) => (
                  <div key={index} className="forecast-entry">
                    <p><b>Time (Date & Hours): </b> {entry.dt_txt ?? 'No Value'}</p>
                    <p><b>Temp:</b> {entry.main.temp ?? 'No Value'}</p>
                    <p><b>Weather:</b> {entry.weather[0].main ?? 'No Value'}</p>
                  </div>
                  
                ))}
              </div>
            </div>


            <details className="raw-data">
              <summary>View Raw Data</summary>
              <pre>{JSON.stringify(weatherData, null, 2) ?? 'No Raw Data Availabe'}</pre>
            </details>
          </div>
        )}
      </section>

      
    </div>

    
  );
}

export default App;
