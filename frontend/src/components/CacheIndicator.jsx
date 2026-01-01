import { formatCacheAge } from "../utils/cache.js";

import '../style/CacheIndicator.css'





function CacheIndicator({ fromCache, age, onRefresh}) {
    if (!fromCache) return null;



    return (
        <div className="cache-indicator">
            <div  className="cache-info">
                <span className="cache-icon">💾</span>
                <span className="cache-text">
                    Cached data ({formatCacheAge(age)} old)
                </span>
            </div>
            <button
                onClick={onRefresh}
                className="cache-refresh-btn"
                title="Fetch Fresh Data"
            >
                Refresh
            </button>
        </div>
    );
}

export default CacheIndicator;