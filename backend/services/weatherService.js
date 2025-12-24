import 'dotenv/config';
import axios from 'axios';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


    console.log(`[DEMO MODE]`, { city, files: fileNames });



    const [current, forecast] = await Promise.all([
        loadDemoData(fileNames.current),
        loadDemoData(fileNames.forecast)
    ]);

    return { current, forecast };

}

/** * fetch current weather for a city from API
 */
async function getCurrentWeather(city, apikey) {
    const url = `${API_URL}/weather`;
    const params = {
        q: city,
        appid: apikey,
        units: 'metric'
    };

    console.log(`[CURRENT WEATHER REQUEST]`, { city, url });



    const response = await axios.get(url, { params });



    console.log(`[CURRENT WEATHER RESPONSE]`, {
        city: response.data.name,
        temp: response.data.main.temp,
        status: response.status
    });

    return response.data;
}

//*** fetch 5-day forecast for a city
//  */
async function getForecast(city, apikey) {
    const url = `${API_URL}/forecast`;
    const params = {
        q: city,
        appid: apikey,
        units: 'metric'

    };


    console.log(`[FORECAST REQUEST]`, { city, url });


    const response = await axios.get(url, { params });


    console.log(`[FORECAST RESPONSE]`, {
        city: response.data.city.name,
        count: response.data.list.length,
        status: response.status
    });


    return response.data;
}


async function getLiveWeatherData(city, apikey) {
    console.log(`[LIVE MODE]`, { city });


    const [current, forecast] = await Promise.all([
        getCurrentWeather(city, apikey),
        getForecast(city, apikey)
    ]);

    return { current, forecast };
}


//*** Combine current weather and forecast
// */
export async function getWeatherData(city, apikey) {
    try {
        if (USE_DEMO) {
            return await getDemoWeatherData(city);
        } else {
            return await getLiveWeatherData(city, apikey);
        }
    } catch (error) {
        console.error(`[WEATHER SERVICE ERROR]:`, {
            mode: USE_DEMO_DATA ? 'demo' : 'live',
            message: error.message,
            response: error.respose?.data,
            status: error.respose?.status
        });
        throw error;
    }
}



export default getWeatherData;