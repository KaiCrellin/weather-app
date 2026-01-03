import { safeGet, formatTemperature, formatWindSpeed, formatHumidity, getWeatherIcon } from "../utils/defensive.js";
import '../style/WeatherDisplay.css';



function  WeatherDisplay({ weatherData }) {
    if (!weatherData) {
        return (
            <div className="weather-display-error">
                <p> No Weather Data Available</p>
            </div>
        )
    }


    const current = weatherData.current || {};
    const forecast = weatherData.forecast || {};


    const cityName = safeGet(current, 'name', 'Unkown City');
    const country = safeGet(current, 'sys.country', '??');
    const temp = safeGet(current, 'main.temp');
    const feelsLike = safeGet(current, 'main.feels_like');
    const humidity = safeGet(current, 'main.humidity');
    const windSpeed = safeGet(current, 'wind.speed');
    const weatherMain = safeGet(current, 'weather.0.main', ' Unknown');
    const weatherDescription = safeGet(current, 'weather.0.description', 'No description');
    const weatherIcon = safeGet(current, 'weather.0.icon');



    const forecastList = Array.isArray(forecast.list) ? forecast.list : [];



    return (
        <div className="weather-display">
            <h3>Results For {cityName} ({country})</h3>



            <div className="current-weather">
                <div className="weather-header">
                    <h4>Current Weather</h4>
                    {weatherIcon && weatherIcon !== 'N/A' && (
                        <img
                            src={getWeatherIcon(weatherIcon)}
                            alt={weatherMain}
                            crossOrigin="anonymous"
                            className="weather-icon"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                console.warn(`[DEFENSIVE] Weather icon Failed to load`, weatherIcon);
                            }}
                        />
                    )}
                </div>

                <div className="weather-data">
                    <div className="weather-data-item">
                        <span className="data-label">Temperature</span>
                        <span className="data-value">{formatTemperature(temp)}</span>
                    </div>

                    <div className="weather-data-item">
                        <span className="data-label"> Feels Like:</span>
                        <span className="data-value">{feelsLike}</span>
                    </div>


                    <div className="weather-data-item">
                        <span className="data-label">Condition:</span>
                        <span className="data-value">{weatherDescription}</span>
                    </div>

                    <div className="weather-data-item">
                        <span className="data-label">Humidity:</span>
                        <span className="data-value">{formatHumidity(humidity)}</span>
                    </div>


                    <div className="weather-data-item">
                        <span className="data-label">Wind Speed:</span>
                        <span className="data-value">{formatWindSpeed(windSpeed)}</span>
                    </div>
                </div> 
            </div>


            <div className="forecast-preview">
                <h4>Forecast Preview</h4>


                {forecast.length === 0 ? (
                    <p className="forecast-empty">No Forecast data available</p>
                ) : (
                    <>
                        <p className="forecast-couint">
                            Total Forecast Entries: {forecastList.length}
                        </p>


                        <div className="forecast-sample">
                            <h5>Next 3 Entries:</h5>
                            <div className="forecast-grid">
                                {forecastList.slice(0,6).map((entry, index) => {
                                const entryTemp = safeGet(entry, 'main.temp');
                                const entryWeather = safeGet(entry, 'weather.0.description', ' Unknown');
                                const entryTime = safeGet(entry, 'dt_txt', 'N/A');
                                const entryIcon = safeGet(entry, 'weather.0.icon');


                                return (
                                    <div key={index} className="forecast-entry">
                                        {entryIcon && entryIcon !== 'N/A' && (
                                            <img
                                                src={getWeatherIcon(entryIcon)}
                                                alt={entryWeather}
                                                className="forecast-icon"
                                                onError={(e) => e.target.style.display = 'none'}
                                            
                                            />
                                        )}
                                        <p className="forecast-time"> Time: {entryTime}</p>
                                        <p className="forecast-temp"> Temperature: {formatTemperature(entryTemp)}</p>
                                        <p className="forecast-weather"> Condition: {entryWeather}</p>


                                        

                                    </div>
                                    
                                );
                            })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <details className="raw-data">
                <summary>View Raw Data</summary>
                <pre>{JSON.stringify(weatherData, null,  2)}</pre>
            </details>
        </div>
    );
}


export default WeatherDisplay;