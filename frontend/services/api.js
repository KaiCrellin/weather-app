import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";



const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});



apiClient.interceptors.request.use(
    (config) => {
        console.log(`[API REQUEST]`, {
            method: config.method.toUpperCase(),
            url: config.url,
            params: config.params,
            fullURL: `${config.baseURL}${config.url}`
        })
        return config
    },
    (error) => {
        console.error(`[API REQUEST ERROR]`, error);
        return Promise.reject(error);
    }
);



apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API RESPONSE]`, {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response
    },
    (error) => {
        console.error(`[API RESPONSE ERROR]`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);


export const checkHealth = async () => {
    try {
        const response = await apiClient.get(`/api/health`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: error.message }
        };
    }
};


export const getWeather = async (city) => {
    try {
        const response = await apiClient.get('/api/weather', {
            params: { city }
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: error.message }
        };
    }
};



export const validateConnection = async () => {
    const results = {
        health: null,
        weather: null,
        overall: false

    };



    const healthCheck = checkHealth();
    results.health = healthCheck;



    const weatherCheck = await getWeather('London');
    results.weather = weatherCheck;



    results.overall = healthCheck.success && weatherCheck.success;


    console.log(`[API VALIDATION]`, results);


    return results;
};


export default apiClient;