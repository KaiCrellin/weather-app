import { useState, useEffect,} from 'react';
import { getAllCachedCities, clearAllCache, formatCacheAge, getCacheStats,} from '../utils/cache.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import '../style/CacheManager.css'



function CacheManager() {
    const [cachedCities, setCachedCities] = useState([]);
    const [stats, setStats] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [removingCity,  setRemovingCity] = useState(null)

    useEffect(() => {
        loadCacheData();
    },[])


    useEffect(() => {
        const REFRESH = 30000;


        const intervalId = setInterval(() => {
            console.log(`[APP] Updating Cache`)
            loadCacheData();
        }, REFRESH)

        return () => clearInterval(intervalId);
    }, [])


    useEffect(() => {
        if (isExpanded) {
            loadCacheData();
        }
    }, [isExpanded])


    const loadCacheData = () => {
        const cities = getAllCachedCities();
        const cacheStats = getCacheStats();
         setCachedCities(cities);
        setStats(cacheStats)
    };
    

   


    const handleClearCache = async () => {
       if (window.confirm("Are you sure you want to clear all cached weather data?")) {
        setIsClearing(true);

        await new Promise(resolve => setTimeout(resolve, 500));


        const cleared = clearAllCache();
        console.log(`[Cache Manage] Cleared`, cleared, 'Cache Entries');


        loadCacheData();
        setIsClearing(false);
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
                    disabled={isClearing}
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
                    <span className="stat-value invalid">{stats.expired ?? 'No Value'}</span>
                </div>
                <div className='cache-stat'>
                    <span className="stat-label"> Duration:</span>
                    <span className="stat-value valid">{stats.durationMinutes ?? 'No Value'} Minutes</span>
                </div>
            </div>
            {isExpanded && (
                <div className="cache-details">
                    <p className="auto-refresh-note"> List Auto Updates every 30s</p>
                    {cachedCities.length === 0 ? (
                        <p className="cache-empty">No Cached Data</p>
                        
                    ) : (
                        <>
                            <div className="cache-list">
                                {cachedCities.map((city, index) => (
                                    <div 
                                        key={index}
                                        className={`cache-item ${city.isExpired ? 'expired' : ''} ${removingCity === city.city ? 'removing' : ''}`}
                                    >
                                        <span className="cache-city-name">
                                            {city.city.charAt(0).toUpperCase() + city.city.slice(1)}
                                        </span>
                                        <span className="cache-city-age">
                                            {formatCacheAge(city.age)}
                                            {city.isExpired && ' (expired)'}
                                        </span>
                                        {removingCity === city.city && (
                                            <div className="cache-item-loading">
                                                <LoadingSpinner show={true} />
                                            </div>
                                        )}
                                        
                                    </div>
                                ))}
                            </div>
                            {isClearing ? (
                                <div className="cache-clearing"> 
                                    <LoadingSpinner show={true} message='Clearing Cache...'/>
                                </div>
                            ) : (
                                <button
                                onClick={handleClearCache}
                                className="clear-cache-btn"
                                disabled={isClearing}
                                
                                >
                                    Clear All Cache
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>

    );
}


export default CacheManager;