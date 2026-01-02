const STORAGE_KEY = 'weather-search-history';
const MAX_HISTORY_ITEMS = 10;




export function getSearchHistory() {
    try {
        const history = localStorage.getItem(STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error(`[SEARCH HISTRORY] Error Reading from localStorage`, error);
        return [];
    }
}



export function addToSearchHistory(cityName, weatherData) {
    try {


        if (!weatherData || !weatherData.current) {
            console.warn(`[SEARCH HISTORY] Cannot add ${cityName} data is missing`)
            return getSearchHistory();
        }


        const history = getSearchHistory();



        const historyItem = {
            city: cityName,
            country: weatherData.current.sys?.country || 'N/A',
            timestamp: Date.now(),
            temp: weatherData.current.main?.temp,
            weather: weatherData.current.weather?.[0]?.main,
            icon: weatherData.current.weather?.[0]?.icon
        }

        const filtered = history.filter(
            item => item.city.toLowerCase() !== cityName.toLowerCase()
        );


        const updated = [historyItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);




        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));


        console.log(`[Search History] Added:`, cityName);
        return updated;
    } catch (error) {
        console.error(`[Search History] Error Saving to localStoarge`, error);
        return history;
    }
}


export function removeFromSearchHistory(cityName) {
    try {
        const history = getSearchHistory();
        const filtered = history.filter(
            item => item.city.toLowerCase() !== cityName.toLowerCase()
        );


        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));


        console.log(`[Search History]: Removed`, cityName);
        return filtered;
    } catch (error) {
        console.error(`[Search History] Error removing from localStorage`, error);
        return getSearchHistory();
    }
}



export function clearSearchHistory() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log(`[Search History] Cleared All History`);
        return [];
    } catch (error) {
        console.error(`[Search History] Error clearing localStorage`, error);
        return [];
    }
}


export function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;


    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);



    if (seconds < 60) return 'Just Now';
    if (minutes < 60) return `${minutes} Minutes Ago`;
    if (hours < 24) return `${hours} Hours Ago`;
    if (days < 7) return `${days} Days ago`;


    return new Date(timestamp).toLocaleDateString();
}