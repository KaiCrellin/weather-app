//**
//  */ Validate City input
export function validatCityInput(input) {


    // Trim input
    const trimmed = input.trim();

    // Ensure trim
    if (!trimmed) {
        return {
            isValid: false,
            sanitized: '',
            error: 'Please enter a city name'
        };
    }

    // Must be more than 3 
    if (trimmed.length < 3) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City name must be at least 3 characters'
        };
    }

    // Cant be more than 50
    if (trimmed.length > 50) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City Name is too long (maximum 50 characters)'
        };
    }


    // Only allow spaces and letters
    const validPattern = /^[a-zA-Z\s]+$/;
    if (!validPattern.test(trimmed)) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City name can only contain letters and spaces'
        };
    }

    // cities cannot containe consequitve spacing
    // e,g New York !== New  York
    if (/\s{2,}/.test(trimmed)) {
        return {
            isValid: false,
            sanitized: trimmed,
            error: 'City name contains too many consecutive spaces'
        };
    }



    // return if passed all.
    return {
        isValid: true,
        sanitized: trimmed,
        error: null
    }
}

//**
//  */ Format City name
export function formatCityName(city) {
    return city
        //split entry
        .split(' ')
        // map over; Example: CharAt(0) = N slice() = ew = New
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        // Join the two works back together ["New" "York"] -> "New York"
        .join(' ');
}

//**
//  */ Input suggestion
export function getInputSuggestion(city) {
    // Sanitize input
    const lower = city.toLowerCase();
    // common misspellings
    const corrections = {
        'londom': 'London',
        'lonon': 'London',
        'tokio': 'Tokyo',
        'newyork': 'New York',
        'losangles': 'Los Angeles',
        'sanfrancisco': 'San Francisco',
        'lasvegas': 'Las Vegas'

    };


    // if city input is one of the correction/ return suggestion adn reason
    if (corrections[lower]) {
        return {
            suggestion: corrections[lower],
            reason: 'did you mean this?'
        };
    }

    // Multi City name mut have spaces newyork -> invalid
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