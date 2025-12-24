import express from 'express';
const router = express.Router();
import getWeatherData from '../services/weatherService.js';

// *** GET /api/weather?city=London

//

router.get('/', async (req, res) => {
    const { city } = req.query;

    // Validate city paramets
    if (!city || city.trim() === '') {
        console.log(`[WEATHER REQUEST: NO CITY FIELD]`, "City Parameter not provided")
        return res.status(400).json({
            error: "City parameter is required",
            example: '/api/weather?city=London'
        });

    }


    // Check API Key exists
    const apikey = process.env.API_KEY;
    if (!apikey) {
        return res.status(500).json({
            error: "Server Configuration error",
            message: "OpenWeather_API_Key not configured"
        });
    }

    try {
        console.log(`[WEATHER REQUEST]`, { city: city.trim() });


        const weatherData = await getWeatherData(city.trim(), apikey);

        // Log Response Structure
        console.log(`[WEATHER RESPONSE STRUCUTRE]`, {
            hasCurrent: !!weatherData.current,
            hasForecast: !!weatherData.forecast,
            currentTemp: weatherData.current?.main?.temp,
            forecastCount: weatherData.forecast?.list?.length
        });

        res.json(weatherData);
    } catch (error) {
        // handle openAPI errors
        if (error.response) {
            const status = error.response.status;

            const message = error.response.data.message || 'unknown error';



            if (status === 404) {
                return res.status(404).json({
                    error: "City Not Found",
                    city: city,
                    message: "Please Check the City name and try again"
                });

            }


            if (status === 401) {
                return res.status(500).json({
                    error: "API Authentication failed",
                    message: "invalid API key Configuration"
                })
            }


            return res.status(status).json({
                error: " Weather API error",
                message: message
            });


        }
        // handle network and other erros
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });

    }
});


export default router;