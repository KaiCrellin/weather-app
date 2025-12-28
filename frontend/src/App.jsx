import { useState, useEffect } from 'react'
import { checkHealth, getWeather, validateConnection } from '../services/api.js';
import { validatCityInput, formatCityName, getInputSuggestion } from './utils/validation.js';
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



  useEffect(() => {
    const checkBackendHealth = async () => {
      console.log(`[APP] Checking Backend Health...`);
      const result = await checkHealth();
      setHealthStatus(result);
      setHealthLoading(false);
    }

    checkBackendHealth();
  }, []);


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



  const handleInputChange = (e) => {
    setCityInput(e.target.value);

    if (weatherError) {
      setWeatherData(null)
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();

    const validation = validatCityInput(cityInput)

    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    const sanitizedCity = validation.sanitized;
    console.log(`[APP] Searcjomg for City:`, sanitizedCity);

    

    setWeatherLoading(true);
    setWeatherError(null);
    setWeatherData(null);
    setValidationError(null);
    setInputSuggestion(null)

    const result = await getWeather(sanitizedCity);


    if (result.success) {
      console.log(`[APP] Weather Data Recieved`, result.data);
      setWeatherData(result.data);
      setCityInput(formatCityName(sanitizedCity));
    } else {
      console.error(`[APP] Weather Error`, result.error);
      setWeatherError(result.error);
    }

    setWeatherLoading(false);
  };



  const handleClear = () => {
    setCityInput('');
    setWeatherData(null);
    setWeatherError(null);
    setValidationError(null);
    setInputSuggestion(null);
  };


  const handleSuggestionClick = () => {
    if (inputSuggestion?.suggestion) {
      setCityInput(inputSuggestion.suggestion);
      setInputSuggestion(null);
    }
  };


 

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p>Phase 5: Weather UI</p>
      </header>


       <section className="health-section">
        <h2>Backend Status</h2>
        {healthLoading ? (
          <p>Checking backend connection...</p>
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



      <section className="weather-section">
        <h2>Weather Search</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <input
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
              {weatherLoading ? 'Searching...': 'Search'}
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




        {weatherError && (
          <div className="weather-error">
            <h3>Error</h3>
            <p>{weatherError.message || weatherError.error} </p>
            {weatherError.city && <p>{weatherError.city}</p>}
          </div>
        )}


        {weatherData && (
          <div className="weather-results">
            <h3>Results for {weatherData.current.name}</h3>

            <div className="current-weather">
              <h4>Current Weather</h4>
              <div className="weather-data">
                <p><b>Temperature:</b> {weatherData.current.main.temp}C</p>
                <p><b>Feels Like:</b> {weatherData.current.main.feels_like}C</p>
                <p><b>Condition:</b> {weatherData.current.weather[0].main}</p>
                <p><b>Description:</b> {weatherData.current.weather[0].description}</p>
                <p><b>Humidiity:</b> {weatherData.current.main.humidity}%</p>
                <p><b>Wind Speed</b> {weatherData.current.wind.speed}m/s</p>
                <p><b>Country</b> {weatherData.current.sys.country}</p>
              </div>
            </div>

            <div className="forecast-preview">
              <h4>Forecast Preview</h4>
              <p>Total Forecast enteries for {weatherData.forecast.list.length}</p>
              <div className="forecast-sample">
                <h5>First 3 Entries:</h5>
                {weatherData.forecast.list.slice(0,3).map((entry, index) => (
                  <div key={index} className="forecast-entry">
                    <p><b>Time:</b> {entry.dt_txt}</p>
                    <p><b>Temp:</b> {entry.main.temp}</p>
                    <p><b>Weather:</b> {entry.weather[0].main}</p>
                  </div>
                  
                ))}
              </div>
            </div>


            <details className="raw-data">
              <summary>View Raw Data</summary>
              <pre>{JSON.stringify(weatherData, null, 2)}</pre>
            </details>
          </div>
        )}
      </section>

      <section className='instructions'>
        <h2>Testing Instructions</h2>
        <ol>
          <li><b>Valid Input</b> Type "London"  Should work</li>
          <li><b>Empty Input:</b> Try to search with empty field - will show error</li>
          <li><b>Too Short:</b> Type "L" Should show minimum length error</li>
          <li><b>Too Long:</b> Type 51+ Characters should show max length error</li>
          <li><b>Invalid Character:</b> Type "London123" Should show character error</li>
          <li><b>Extra Spaces:</b> Type: "New  York" (double space) Should show spacing error</li>
          <li><b>Misspelling:</b> Type "Londom" should suggest "london"</li>
          <li><b>Clear Button:</b> Type Text Click X should clear input</li>
          <li><b>Formatting:</b> Type "london After Search Should format to "London" </li>
        </ol>

        <h3>New Features</h3>
        <ol>
          <li>Real Time Input Validation (300ms Debounce)</li>
          <li>Min-Max length Validation (2-50 characters)</li>
          <li>Character Validation (letters, spaces, hyphens, apostrophes only)</li>
          <li>Automatic WHitespace trimming</li>
          <li>city name formatting (capitalize words)</li>
          <li>Misspelling suggestions</li>
          <li>Clear button (x) in input field</li>
          <li>Clear results button</li>
          <li>Disabled states during loading</li>
        </ol>
      </section>
    </div>

    
  );
}

export default App;
