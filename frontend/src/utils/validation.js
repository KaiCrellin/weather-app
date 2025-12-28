export function validatCityInput(input) {



    const trimmed = input.trim();


    if (!trimmed) {
        return {
            isValid: false,
            sanitized: '',
            error: 'Please enter a city name'
        };
    }


    if (trimmed.length < 3) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City name must be at least 3 characters'
        };
    }


    if (trimmed.length > 50) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City Name is too long (maximum 50 characters)'
        };
    }



    const validPattern = /^[a-zA-Z\s]+$/;
    if (!validPattern.test(trimmed)) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City name can only contain letters and spaces'
        };
    }


    if (/\s{2,}/.test(trimmed)) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City name contains too many consecutive spaces'
        };
    }




    return {
        isValid: true,
        sanitized: trimmed,
        error: null
    }
}


export function formatCityName(city) {
    return city
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}


export function getInputSuggestion(city) {
    const lower = city.toLowerCase();

    const corrections = {
        'londom': 'London',
        'lonon': 'London',
        'tokio': 'Tokyo',
        'newyork': 'New York',
        'losangles': 'Los Angeles',
        'sanfrancisco': ' San Francisco',
        'lasvegas': 'Las Vegas'

    };



    if (corrections[lower]) {
        return {
            suggestion: corrections[lower],
            reason: 'did you mean this?'
        };
    }


    if (lower.includes('new') && !lower.includes(' ')) {
        return {
            suggestion: null,
            reason: 'Multi-Word City name need spaces (e.g New York)'
        };
    }

    return {
        suggestion: null,
        reason: null
    }
}