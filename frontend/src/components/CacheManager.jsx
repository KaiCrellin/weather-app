import { useState, useEffect, useCallback} from 'react';
import { getAllCachedCities, clearAllCache, formatCacheAge, getCacheStats, removeCachedWeather } from '../utils/cache.js';
import '../style/CacheManager.css'



function CacheManager() {
    const [cachedCities, setCachedCities] = useState([]);
    const [stats, setStats] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);


    

    const loadCacheData = useCallback(() => {
        setCachedCities(getAllCachedCities());
        setStats(getCacheStats())
    }, []);

    useEffect(() => {
        loadCacheData();


        let interval;
        if (isExpanded) {
            interval = setInterval(() => {
                console.log(`[CACHE Auto-Refreshing ages...]`);
                loadCacheData();
            }, 60000);
        }

        return () => clearInterval(interval);
    }, [isExpanded, loadCacheData]);



    const handleClearCache = () => {
        if (window.confirm('Are you sure you want to clear all cached weather data')) {
        const cleared = clearAllCache();
        console.log(`[CACHE MANAGER] CLeared`, cleared, 'Cache Entries');
            loadCacheData();
        }
    };

    if (!stats) return null;



    return (
        <div className="cache-manager">
            <div className="cache-manager-header">
                <h3>Cache Manager - Refresh by toggle =</h3>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cache-toggle-btn"
                >

                    {isExpanded ? '▼' : '▶'} {isExpanded ? 'Hide' : 'Show'} Details
                </button>
            </div>

            <div className="cache-stats">
                <div className="cache-stat">
                    <span className="stat-label">Total Cached:</span>
                    <span className="stat-value">{stats.total ?? 'No Value'}</span>
                </div>
                <div className='cache-stat'>
                    <span className="stat-label"> Valid:</span>
                    <span className="stat-value valid">{stats.valid ?? 'No Value'}</span>
                </div>
                <div className='cache-stat'>
                    <span className="stat-label"> Expired:</span>
                    <span className="stat-value valid">{stats.expired ?? 'No Value'}</span>
                </div>
                <div className='cache-stat'>
                    <span className="stat-label"> Duration:</span>
                    <span className="stat-value valid">{stats.durationMinutes ?? 'No Value'} Minutes</span>
                </div>
            </div>
            {isExpanded && (
                <div className="cache-details">
                    {cachedCities.length === 0 ? (
                        <>
                        <p className="cache-empty">No Cached Data</p>
                        <p className="cache-empty">Refresh by collapsing Details</p>
                        
                        </>
                    ) : (
                        <>
                            <div className="cache-list">
                                {cachedCities.map((city, index) => (
                                    <div 
                                        key={index}
                                        className={`cache-item ${city.isExpired ? 'expired' : ''}`}
                                    >
                                        <span className="cache-city-name">
                                            {city.city.charAt(0).toUpperCase() + city.city.slice(1)}
                                        </span>
                                        <span className="cache-city-age">
                                            {formatCacheAge(city.age)}
                                            {city.isExpired && ' (expired)'}
                                        </span>
                                        <button
                                            onClick={() => removeCachedWeather(city.city)}
                                            className='delete-item-btn'
                                            title='Delete This Entry'
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleClearCache}
                                className="clear-cache-btn"
                            >
                                Clear All Cache
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>

    );
}


export default CacheManager;