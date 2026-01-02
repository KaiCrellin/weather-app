const CACHE_PREFIX = 'weather_cache_';
const CACHE_DURATION = 10 * 120 * 1000;






function getCacheKey(city) {
    return `${CACHE_PREFIX}${city.toLowerCase()}`;
}

export function getCachedWeather(city) {
    try {
        const key = getCacheKey(city);
        const cached = localStorage.getItem(key);


        if (!cached) {
            console.log(`[CACHE ]Miss:`, city);
            return null;
        }


        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const age = now - timestamp;


        if (age > CACHE_DURATION) {
            console.log(`[CACHE]Expired:`, city, `(${Math.round(age / 60000)} Minutes Old)`);
            localStorage.removeItem(key);
            return null;
        }
        console.log(`[CACHE]Hit:`, city, `${Math.round(age / 1000)}`, 'Old');
        return {
            data,
            timestamp,
            age,
            fromCache: true
        }
    } catch (error) {
        console.error(`[CACHE]Error Reading Cache `, error);
        return null;
    }
}


export function setCachedWeather(city, data) {
    try {
        const key = getCacheKey(city);
        const cacheEntry = {
            data,
            timestamp: Date.now()
        };



        localStorage.setItem(key, JSON.stringify(cacheEntry));
        console.log(`[CACHE Stored]`, city);
    } catch (error) {
        console.error(`[CACHE]Error Storing Cache`, error)
    }
}



export function removeCachedWeather(city) {
    try {
        const key = getCacheKey(city);
        localStorage.removeItem(key);
        console.log(`[CACHE Removed]`, city);
    } catch (error) {
        console.error(`[CACHE]Error Removing Cache`, city);
    }
}


export function clearAllCache() {
    try {
        const keys = Object.keys(localStorage);
        let cleared = 0;


        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
                cleared++;
            }
        });


        console.log(`[CACHE] Cleared All Cache`, cleared, 'items');
        return cleared;
    } catch (error) {
        console.error(`[CACHE]Error Clearing Cache`, error);
        return 0;
    }
}


export function getAllCachedCities() {
    try {
        const keys = Object.keys(localStorage);
        const cached = [];

        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                try {
                    const city = key.replace(CACHE_PREFIX, '');
                    const data = JSON.parse(localStorage.getItem(key));
                    const age = Date.now() - data.timestamp;


                    cached.push({
                        city,
                        timestamp: data.timestamp,
                        age,
                        isExpired: age > CACHE_DURATION
                    });
                } catch (error) {
                    console.error(`[CACHE] Error Reading Cached City`);
                }
            }
        });


        return cached.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error(`[CACHE] Error getting all cached cities`);
        return [];
    }
}



export function formatCacheAge(age) {
    const seconds = Math.floor(age / 1000);
    const minutes = Math.floor(seconds / 60);


    if (minutes === 0) return `${seconds} Seconds`;
    if (minutes < 60) return `${minutes} minutes ago ${seconds % 60} Seconds Ago`;


    const hours = Math.floor(minutes / 60);
    return `${hours} Hours ago ${minutes % 60} Minutes Ago`;
}



export function getCacheStats() {
    const allCached = getAllCachedCities();
    const valid = allCached.filter(c => !c.isExpired);
    const expired = allCached.filter(c => c.isExpired);

    return {
        total: allCached.length,
        valid: valid.length,
        expired: expired.length,
        duration: CACHE_DURATION,
        durationMinutes: CACHE_DURATION / 60000
    }
}