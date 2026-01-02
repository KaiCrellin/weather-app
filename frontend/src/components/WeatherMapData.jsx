import {MapContainer, TileLayer, Marker, Popup, useMap,} from 'react-leaflet';
import { safeGet, formatTemperature, formatWindSpeed, formatHumidity} from '../utils/defensive.js'


function RecenterMap({ lat, lon }) {
    const map = useMap()
    map.flyTo({lat, lon}, 10);
    return null;
}


export default function WeatherMap({ weatherData }) {
    const lat = safeGet(weatherData, 'current.coord.lat', 0);
    const lon = safeGet(weatherData, 'current.coord.lon', 0);
    const country = safeGet(weatherData, 'current.sys.country', '??');
    const temp = safeGet(weatherData, 'current.main.temp');
    const feelsLike = safeGet(weatherData, 'current.main.feels_like');
    const humidity = safeGet(weatherData, 'current.main.humidity');
    const windSpeed = safeGet(weatherData, 'current.wind.speed');
    const weatherMain = safeGet(weatherData, 'current.weather.0.main', ' Unknown');
    const weatherDescription = safeGet(weatherData, 'current.weather.0.description', 'No description');
   

    return (
        <div className="map-container" > 
            <MapContainer center={[lat, lon]} zoom={10} style={{height: '400px', width: '100%'}}>
                <TileLayer url=" https://tile.openstreetmap.org/{z}/{x}/{y}.png" />


                <Marker position={[lat, lon]} style={{borderTop: '1px solid red'}}>
                    <Popup className="popUp">
                

                        <p><b>City:</b>{weatherData.current.name}: </p>
                        <p><b>Condition:</b> {weatherMain}</p>
                        <p><b>Weather Description:</b>{weatherDescription}</p>
                        <p><b>Country Code:</b>{country}:</p>
                        <p><b>Temperature:</b> {formatTemperature(temp)}:</p>
                        <p><b>Feels Like:</b> {feelsLike}</p>
                        <p><b>Humidity:</b>{formatHumidity(humidity)}:</p>
                        <p><b>Wind Speed</b>{formatWindSpeed(windSpeed)}:</p>


                    </Popup>
                
                </Marker>



                <RecenterMap lat={lat} lon={lon}/>
            </MapContainer>
        </div>
    );
}


