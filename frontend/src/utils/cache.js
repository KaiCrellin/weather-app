// Set Cache prefix for targeting and a 20 Min TTL
const CACHE_PREFIX = 'weather_cache_';
const CACHE_DURATION = 10 * 60 * 1000; // 1,200,000 MS





//**
//  / Get Cache Key for targetig
function getCacheKey(city) {
    // Target Cache Prefix wtih city input to lowercase and trimmed to ensure correct targeting.
    return `${CACHE_PREFIX}${city.toLowerCase().trim()}`;
}

//** 
// */ Get CacheWeather by city

export function getCachedWeather(city) {
    try {
        // Establish targeting,
        const key = getCacheKey(city);
        // Logged Targeting for debugging - Removing now 
        // console.log(key)
        // Get item by key. example weather_cache_london
        const cached = localStorage.getItem(key);

        // if this doesnt exist return null
        if (!cached) {
            // Log cache miss
            console.log(`[CACHE ]Miss:`, city);
            return null;
        }

        // set cached data in a object literal
        const { data, timestamp } = JSON.parse(cached);
        // Date now
        const now = Date.now();
        // Cache entry age
        const age = now - timestamp;

        // if age, is more than, duration, remove the key from localStorage
        if (age > CACHE_DURATION) {
            console.log(`[CACHE]Expired:`, city, `(${Math.round(age / 60000)} Minutes Old)`);
            localStorage.removeItem(key);
            return null;
        }
        // if age is not, show cache hit, and age of entry
        console.log(`[CACHE]Hit:`, city, `${Math.round(age / 1000)}`, 'Old');
        // return data in a object literal. 
        return {
            data,
            timestamp,
            age,
            fromCache: true
        }
    } catch (error) {
        // Catch errors
        console.error(`[CACHE]Error Reading Cache `, error);
        return null;
    }
}


export function setCachedWeather(city, data) {
    try {
        // Establish targeting
        const key = getCacheKey(city);
        // CacheEntry Strucuure
        const cacheEntry = {
            data,
            timestamp: Date.now()
        };


        // Set key e.g "weather_cache_london" and stringify it
        localStorage.setItem(key, JSON.stringify(cacheEntry));
        // Log Stored
        console.log(`[CACHE Stored]`, city);
    } catch (error) {
        // Catch errors
        console.error(`[CACHE]Error Storing Cache`, error)
    }
}


// Removed Individual Cache Entry function - added but not used.
export function removeCachedWeather(city) {
    try {
        const key = getCacheKey(city);
        localStorage.removeItem(key);
        console.log(`[CACHE Removed]`, city);
    } catch (error) {
        console.error(`[CACHE]Error Removing Cache`, city);
    }
}

// Clear all Cache
export function clearAllCache() {
    try {
        // Establish All Targets - (all entries)
        const keys = Object.keys(localStorage);
        // set cleared variable.
        let cleared = 0;

        // Iterate over the keys
        keys.forEach(key => {
            // if the keys start with weather_cache
            if (key.startsWith(CACHE_PREFIX)) {
                // Delete them
                localStorage.removeItem(key);
                // Iterate by 1
                cleared++;
            }
        });

        // Log for clear
        console.log(`[CACHE] Cleared All Cache`, cleared, 'items');
        return cleared;
    } catch (error) {
        // Catch errors
        console.error(`[CACHE]Error Clearing Cache`, error);
        return 0;
    }
}

//**
//  */ Get all CachedCities
export function getAllCachedCities() {
    try {
        // Establishg all targets
        const keys = Object.keys(localStorage);
        const cached = []; // set a cleared array literal
        // Iterate of the keys
        keys.forEach(key => {
            // if starts with weather_cache
            if (key.startsWith(CACHE_PREFIX)) {
                try {
                    // Strip prefix from the city name
                    const city = key.replace(CACHE_PREFIX, '');
                    // get local Storage items by key
                    const data = JSON.parse(localStorage.getItem(key));
                    // age of entries
                    const age = Date.now() - data.timestamp;


                    // Push to empty array
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

        // Return and ordered list by timestamp
        return cached.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        // Catch errors
        console.error(`[CACHE] Error getting all cached cities`);
        return [];
    }
}


//**
//  */ Format Cache Age
export function formatCacheAge(age) {
    // establish times
    const seconds = Math.floor(age / 1000);
    const minutes = Math.floor(seconds / 60);

    // if minutes are ===0 = seconds if minutes < 60 Minutes ago so on 
    if (minutes === 0) return `${seconds} Seconds`;
    if (minutes < 60) return `${minutes} minutes ago ${seconds % 60} Seconds Ago`;


    const hours = Math.floor(minutes / 60);
    return `${hours} Hours ago ${minutes % 60} Minutes Ago`;
}


//** 
// */ Get Cache Stats
export function getCacheStats() {
    // Const calling getAllCachedCities()
    const allCached = getAllCachedCities();
    // Valid Cache entry
    const valid = allCached.filter(c => !c.isExpired);
    // invalid Cache Entry
    const expired = allCached.filter(c => c.isExpired);
    // returns total entries, valid, entries, expired, 
    // entries, the duration of entries and the duration in minuts (20 Minutes)
    return {
        total: allCached.length,
        valid: valid.length,
        expired: expired.length,
        duration: CACHE_DURATION,
        durationMinutes: CACHE_DURATION / 60000
    }
}