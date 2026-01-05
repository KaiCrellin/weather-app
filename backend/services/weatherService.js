import 'dotenv/config';
import axios from 'axios';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Import Directory Name
const __dirname = import.meta.dirname
const API_URL = 'https://api.openweathermap.org/data/2.5';
const USE_DEMO = process.env.USE_DEMO_DATA === "true";



/** *  Load DemoData from JSON File
*/
async function loadDemoData(filename) {
    const filePath = join(__dirname, '..', 'data', filename);


    try {
        const data = await readFile(filePath, 'utf8')
        console.log(`[DEMO DATA LOADED]`, { filename });
        return JSON.parse(data);
    } catch (error) {
        console.error(`[DEMO DATA ERROR]:`, { filename, error: error.message });
        throw new Error(`Demo data file not found ${filename}`);
    }
}

/** * GET demom data for a city 
*/
async function getDemoWeatherData(city) {
    // Sanitize Data
    const cityLower = city.toLowerCase();


    const cityFileMap = {
        "london": {
            current: 'demo-current-london.json',
            forecast: 'demo-forecast-london.json'
        },
        "tokyo": {
            current: 'demo-current-tokyo.json',
            forecast: 'demo-forecast-tokyo.json'
        }
    };


    const fileNames = cityFileMap[cityLower];


    if (!fileNames) {
        const error = new Error(`city not found`);
        error.response = {
            status: 404,
            data: { message: 'city not found' }
        }
        throw error;
    }

    // Log foe debugging
    console.log(`[DEMO MODE]`, { city, files: fileNames });


    // Await the LoadDemoData Function
    const [current, forecast] = await Promise.all([
        loadDemoData(fileNames.current),
        loadDemoData(fileNames.forecast)
    ]);

    // Retunrs as object literal
    return { current, forecast };

}

/** * fetch current weather for a city from API
 */
async function getCurrentWeather(city, apikey) {
    // Establish API URL with handling for security
    const url = `${API_URL}/weather`;
    // Request Parameters
    const params = {
        q: city,
        appid: apikey,
        units: 'metric'
    };
    // Log for debugging
    console.log(`[CURRENT WEATHER REQUEST]`, { city, url });


    // response awaiting url target and parameters
    const response = await axios.get(url, { params });


    // Log for bugging 
    console.log(`[CURRENT WEATHER RESPONSE]`, {
        city: response.data.name,
        temp: response.data.main.temp,
        status: response.status
    });
    // Return Data
    return response.data;
}

//*** fetch 5-day forecast for a city
//  */
async function getForecast(city, apikey) {
    // Establish API URL with handling for security
    const url = `${API_URL}/forecast`;
    // Request Parameters
    const params = {
        q: city,
        appid: apikey,
        units: 'metric'

    };


    // Log for debugging
    console.log(`[FORECAST REQUEST]`, { city, url });

    // response awaiting url and parameters
    const response = await axios.get(url, { params });


    // Log for debugging
    console.log(`[FORECAST RESPONSE]`, {
        city: response.data.city.name,
        count: response.data.list.length,
        status: response.status
    });

    // return 
    return response.data;
}


async function getLiveWeatherData(city, apikey) {
    // Log for configuration
    console.log(`[LIVE MODE]`, { city });

    // await function getCurrentWeather and getForecast
    const [current, forecast] = await Promise.all([
        getCurrentWeather(city, apikey),
        getForecast(city, apikey)
    ]);
    // Return as object literal - One Endpoint 
    return { current, forecast };
}


//*** Combine current weather and forecast
// */
export async function getWeatherData(city, apikey) {
    try {
        // if USE_DEMO === true
        if (USE_DEMO) {
            // return Demo Data
            return await getDemoWeatherData(city);
        } else {
            // Else return LiveAPIdata - One Endpoint
            return await getLiveWeatherData(city, apikey);
        }
    } catch (error) {
        // Log for debugging
        console.error(`[WEATHER SERVICE ERROR]:`, {
            mode: USE_DEMO ? 'demo' : 'live',
            message: error.message,
            response: error.respose?.data,
            status: error.respose?.status
        });
        throw error;
    }
}


// Export Service
export default getWeatherData;