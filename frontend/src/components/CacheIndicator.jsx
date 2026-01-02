import { useState } from 'react'
import { formatCacheAge } from "../utils/cache.js";
import '../style/CacheIndicator.css'





function CacheIndicator({ fromCache, age, onRefresh}) {
    const [isRefreshing , setIsRefreshing] = useState(false);
    if (!fromCache) return null;

    if (!fromCache) {
        return null;
    }

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false),500);
    }



    return (
        <div className="cache-indicator">
            <div  className="cache-info">
                <span className="cache-icon">💾</span>
                <span className="cache-text">
                    Cached data ({formatCacheAge(age)} old)
                </span>
            </div>
            <button
                onClick={handleRefresh}
                className="cache-refresh-btn"
                disabled={isRefreshing}
                title="Fetch Fresh Data"
            >
                {isRefreshing ? (
                    <>
                        <span className="button-spinner">
                            Refreshing...
                        </span>
                    </>
                ) : (
                    <>
                        Refresh
                    </>
                )}
            </button>
        </div>
    );
}

export default CacheIndicator;