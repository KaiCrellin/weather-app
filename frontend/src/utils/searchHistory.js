// Set Storage key and max entires
const STORAGE_KEY = 'weather-search-history';
const MAX_HISTORY_ITEMS = 10; // 10



//**
//  */ Get SearchHistory
export function getSearchHistory() {
    try {
        // Get LocalStorage item
        const history = localStorage.getItem(STORAGE_KEY);
        //  return through JSON.parse or fallback to empty object
        return history ? JSON.parse(history) : [];
    } catch (error) {
        // warn
        console.error(`[SEARCH HISTRORY] Error Reading from localStorage`, error);
        return [];
    }
}


//**
//  */ add to search history
export function addToSearchHistory(cityName, weatherData) {
    try {

        // if weather data or current is not present
        if (!weatherData || !weatherData.current) {
            // warn console
            console.warn(`[SEARCH HISTORY] Cannot add ${cityName} data is missing`)
            // call getSearchHistroy function
            return getSearchHistory();
        }

        // Establish search history through function getSearchHistory
        const history = getSearchHistory();


        // HistoryItem response strucutre
        const historyItem = {
            city: cityName,
            country: weatherData.current.sys?.country || 'N/A',
            timestamp: Date.now(),
            temp: weatherData.current.main?.temp,
            weather: weatherData.current.weather?.[0]?.main,
            icon: weatherData.current.weather?.[0]?.icon
        }
        // create new array, and checking against entries
        const filtered = history.filter(
            item => item.city.toLowerCase() !== cityName.toLowerCase()
        );

        // Update the histroy item (Last In, First Out)  with Max_History_item Boundary
        const updated = [historyItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);



        // Set LocalStorage  item
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));


        console.log(`[Search History] Added:`, cityName);
        return updated;
    } catch (error) {
        // Catch errors
        console.error(`[Search History] Error Saving to localStoarge`, error);
        return history;
    }
}

//** 
//  */ Remove from SearchHistory
export function removeFromSearchHistory(cityName) {
    try {
        // Get search histroy
        const history = getSearchHistory();
        // create new array, and checking against entries
        const filtered = history.filter(
            item => item.city.toLowerCase() !== cityName.toLowerCase()
        );

        // Store new array inside LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));


        console.log(`[Search History]: Removed`, cityName);
        return filtered;
    } catch (error) {
        // Catch errors
        console.error(`[Search History] Error removing from localStorage`, error);
        return getSearchHistory();
    }
}


//**
//  */ Clear all search history
export function clearSearchHistory() {
    try {
        // remove all items by storage key
        localStorage.removeItem(STORAGE_KEY);
        console.log(`[Search History] Cleared All History`);
        return [];
    } catch (error) {
        // Catch errors.
        console.error(`[Search History] Error clearing localStorage`, error);
        return [];
    }
}

// FormatRelativeTime
export function formatRelativeTime(timestamp) {
    // Date now
    const now = Date.now();
    // Date Diff
    const diff = now - timestamp;

    // Use diff /1000 for seconds
    const seconds = Math.floor(diff / 1000);
    // use Seconds /70 for minutes
    const minutes = Math.floor(seconds / 60);
    //Use minutes /60 for hours
    const hours = Math.floor(minutes / 60);
    // Use hours /24 for days
    const days = Math.floor(hours / 24);


    // Conditions for returning format
    if (seconds < 60) return 'Just Now';
    if (minutes < 60) return `${minutes} Minutes Ago`;
    if (hours < 24) return `${hours} Hours Ago`;
    if (days < 7) return `${days} Days ago`;

    // Returns the tiemstamp toLocalDateString for human readable values. 
    return new Date(timestamp).toLocaleDateString();
}