import { useState, useEffect } from 'react'
import { checkHealth, getWeather, validateConnection } from '../services/api'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [cityInput, setCityInput] = useState('London');



  useEffect(() => {
    const checkBackendHealth = async () => {
      console.log(`[APP] Checking Backend Health...`);
      const result = await checkHealth();
      setHealthStatus(result);
      setHealthLoading(false);
    }

    checkBackendHealth();
  }, [])


  const handleSearch = async (e) => {
    e.preventDefault();

    if (!cityInput.trim() ) {
      setWeatherError({message: 'Please Enter a City Name'});
      return;
    }


    console.log(`[APP] Searching for city`, cityInput);

    setWeatherLoading(true);
    setWeatherError(null);
    setWeatherData(null);

    const result = await getWeather(cityInput.trim());


    if (result.success) {
      console.log(`[APP] Weather Data Recieved`, result.data);
      setWeatherData(result.data);
    } else {
      console.error(`[APP] Weather Error`, result.error);
      setWeatherError(result.error);
    }

    setWeatherLoading(false);
  };


  const handleValidation = async () => {
    console.log(`[APP] Running API Validation...`);
    await validateConnection();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p>Phase 4: Frontend Foundation</p>
      </header>


      <section className="health-section">
        <h2>Backend Status</h2>
        {healthLoading ? (
          <p>Checking Backend connection...</p>
        ) : healthStatus.success ? (
          <div className="health-success">
            <p>Backend Connected</p>
            <pre>{JSON.stringify(healthStatus.data, null, 2)}</pre>
          </div>
        ) : (
          <div className="health-error">
            <p>Backend Connection Failed</p>
            <pre>{JSON.stringify(healthStatus.error,null,2)}</pre>
            <p className="health-text">
              Make Sure Backend is running: <code>cd backend && npm run dev</code>
            </p>
          </div>
        )}
        <button onClick={handleValidation} className="btn-secondary">
          Run Validation
        </button>
      </section>



      <section className="weather-dashboard">
        <h2>Weather Search</h2>
        <form onSubmit={handleSearch} className="search-input">
          <input 
          type="text"
          value={cityInput}
          onChange={(e) =>  setCityInput(e.target.value)}
          placeholder='Enter City Name'
          className='Search-input'
          disabled={weatherLoading} 
          />
          <button
          type="submit"
          className='btn-primary'
          disabled={weatherLoading || !healthStatus?.success}
          >
            {weatherLoading ? 'Loading...' : 'Search'}
          </button>
        </form>


        {weatherError && (
          <div className='weather-error'>
            <h3>Error</h3>
            <p>{weatherError.message || weatherError.error}</p>
            {weatherError.city && <p>{weatherError.error}</p>}

          </div>
        )}

        {weatherData && (
          <div className='weather-results'>
            <h3>Results for {weatherData.current.name}</h3>


            <div className='current-weather'>
              <h4> Current Weather</h4>
              <div className='weather-data'>
                <p><strong>Temperature:</strong> {weatherData.current.main.temp}C</p>
                <p><strong>Feels Like:</strong> {weatherData.current.main.feels_like}C</p>
                <p><strong>Condition:</strong> {weatherData.current.weather[0].main}</p>
                <p><strong>Description:</strong> {weatherData.current.weather[0].description}</p>
                <p><strong>Humidity:</strong> {weatherData.current.main.humidity}%</p>
                <p><storng>Wind Speed:</storng> {weatherData.current.wind.speed} m/s</p>
                <p><strong>Country:</strong> {weatherData.current.sys.country}</p>
              </div>
            </div>

            <div className='forecast-freview'>
              <h4>Forecast Preview</h4>
              <p>Total Forecast Entries: {weatherData.forecast.list.length}</p>
              <div className='forecast-sample'>
                <h5>First 3 entires</h5>
                {weatherData.forecast.list.slice(0,3).map((entry,index) => (
                  <div key={index} className='forecast Entry'>
                    <p><strong>Time:</strong> {entry.dt_txt}</p>
                    <p><strong>Temp:</strong> {entry.main.temp}C</p>
                    <p><strong>Weather:</strong> {entry.weather[0].main}</p> 
                  </div>
                ))}
              </div>
            </div>


            <details className='raw-data'>
              <summary>View Raw Data</summary>
              <pre>{JSON.stringify(weatherData, null, 2)}</pre>
            </details>
          </div>

          
        )}
      </section>

      <section className='instructions'>
        <h2>Testing Instructions</h2>
        <ol>
          <li>Verify "backend Connected" shows above</li>
          <li>Search for "London" (guaranteed to work in demo mode)</li>
          <li>Try "Tokyo" (also in demo Data)</li>
          <li>Try "Paris" (Show Show 404 error in demo mode)</li>
          <li>Open Broswer console to see all API Logs</li>
        </ol>
      </section>
    </div>

    
  )
}

export default App;
