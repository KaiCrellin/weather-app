

//**
//  */ Safe Get utility
export function safeGet(obj, path, fallback = 'N/A') {
    try {
        // split target current.main.temp [curret, main, temp]
        const keys = path.split('.');
        let result = obj;


        // Interate through eack key
        for (const key of keys) {
            // check if each entry is null or undefined
            if (result === null || result === undefined) {
                // return fallback value
                return fallback;
            }
            // Tunnel Through the JSON object
            // e.g 1st loop, result = {current: {mainL {temp:20}}}
            // e,g 2nd loop, result = {main: {temp: 20}}
            result = result[key];

        }
        // return result if not null or undefined. if so fallback
        return result !== null && result !== undefined ? result : fallback;
    } catch (error) {
        // Catch erros and warn console.
        console.warn(`[DEFENSIVE] Error accessing path`, path, error);
        return fallback;
    }
}


//**
//  */ ValidateWeatherData Function
export function validateWeatherData(data) {
    // Object literals, errors, and warnings
    const errors = [];
    const warnings = [];

    // Check all data is present, 
    // not null or undefined. 
    // If so push warnnings and errors respectively

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
    // if errors are 0 isValid = true
    const isValid = errors.length === 0;
    // if isValid is false errors.length > 0
    if (!isValid) {
        // if !isValid push console erros
        console.error(`[DEFENSIVE] Weather data validation Failed`, errors);
    }
    // if warnings.length is more than 0, push console warnings
    if (warnings.length > 0) {
        console.warn(`[DEFENSIVE] Weather data warnings:`, warnings);
    }
    // return object literal with warnings, erros and data,. 
    return { isValid, errors, warnings, data };
}

// Format Temperature
export function formatTemperature(temp) {
    // Check if temp is null, undefined or Not a Number -this is done the same for the
    // next 2 functions
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

// getWeatherIcon
export function getWeatherIcon(iconCode) {
    // if not iconcode return a temp emoji
    if (!iconCode) {
        return '🌡️';
    }
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

}

// safeArray function 
export function safeArray(arr, maxLength = 100) {
    // Check if array is an array
    if (!Array.isArray(arr)) {
        // warn 
        console.warn(`[DEFENSIVE] Expected Array, Got:`, typeof arr);
        return [];
    }
    // check if arr is longer than max-length
    if (arr.length > maxLength) {
        // warn
        console.warn(`[DEFENSIVE] Array exceeds max length, truncating`, arr.length, '->', maxLength);
        return arr.slice(0, maxLength)
    }
    // return array 
    return arr;
}


