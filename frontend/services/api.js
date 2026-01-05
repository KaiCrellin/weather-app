import axios from 'axios';

// Import Frontend Env variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


// Create an "Axios Instance"
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});


// Console Interceptors to Log all API Requests.
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

// Function to check server health
export const checkHealth = async () => {
    try {
        // Await Axios get response to API endpoint /api/health
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
    // Return data if successfull, return error if unsuccessful
};

// Function to getWeatherData
export const getWeather = async (city) => {
    try {
        // Await Axios get response to API Endpoint /api/weather
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
    // Returns data if successful, returns error if unsuccessful.
};


// export apiClient
export default apiClient;