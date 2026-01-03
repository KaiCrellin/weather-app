


export function safeGet(obj, path, fallback = 'N/A') {
    try {
        const keys = path.split('.');
        let result = obj;



        for (const key of keys) {
            if (result === null || result == undefined) {
                return fallback;
            }
            result = result[key];

        }
        return result !== null && result !== undefined ? result : fallback;
    } catch (error) {
        console.warn(`[DEFENSIVE] Error accessing path`, path, error);
        return fallback;
    }
}



export function validateWeatherData(data) {
    const errors = [];
    const warnings = [];


    if (!data) {
        errors.push(`Weather data is null or undefined`);
        return { isValid: false, errors, warnings };
    }


    if (!data.current) {
        errors.push(`Missing current weather data`);
    }

    if (!data.forecast) {
        errors.push(`Missing Forecast Data`);
    }


    if (data.current) {
        if (!data.current.name) warnings.push(`Missing City Name`);
        if (!data.current.main) {
            errors.push(`Missing current.main data`);
        } else {
            if (data.current.main.temp === undefined) warnings.push(`Missing Teperature Data`);
            if (data.current.main.humidity === undefined) warnings.push(`Missing Humidity Data`);
        }
        if (!data.current.weather || !Array.isArray(data.current.weather) || data.current.weather.length === 0) {
            warnings.push(`Missing Weather Conditions Array`);
        }
    }

    if (data.forecast) {
        if (!data.forecast.list || !Array.isArray(data.forecast.list)) {
            errors.push(`Forecast List is not an array`);
        } else if (data.forecast.list.length === 0) {
            warnings.push(`Forecast List is empty`);
        }
    }
    const isValid = errors.length === 0;

    if (!isValid) {
        console.error(`[DEFENSIVE] Weather data validation Failed`, errors);
    }
    if (warnings.length > 0) {
        console.warn(`[DEFENSIVE] Weather data warnings:`, warnings);
    }
    return { isValid, errors, warnings, data };
}


export function formatTemperature(temp) {
    if (temp === null || temp === undefined || isNaN(temp)) {
        return 'N/A';
    }
    return `${Math.round(temp)}C`
}

export function formatWindSpeed(speed) {
    if (speed === null || speed === undefined || isNaN(speed)) {
        return 'N/A';
    }
    return `${speed.toFixed(1)} m/s`
}


export function formatHumidity(humidity) {
    if (humidity === null || humidity === undefined || isNaN(humidity)) {
        return 'N/A';
    }
    return `${humidity}%`;
}


export function getWeatherIcon(iconCode) {
    if (!iconCode) {
        return '🌡️';
    }
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

}


export function safeArray(arr, maxLength = 100) {
    if (!Array.isArray(arr)) {
        console.warn(`[DEFENSIVE] Expected Array, Got:`, typeof arr);
        return [];
    }

    if (arr.length > maxLength) {
        console.warn(`[DEFENSIVE] Array exceeds max length, truncating`, arr.length, '->', maxLength);
        return arr.slice(0, maxLength)
    }
    return arr;
}


