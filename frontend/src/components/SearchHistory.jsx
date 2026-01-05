import { formatRelativeTime } from "../utils/searchHistory.js";

// Import CSS
import '../style/SearchHistory.css'



function SearchHistory({history, onSelectCity, onRemoveCity, onClearHistory}) {
    // if request is not history or history.length is === 0 reutrn No Searches
    if (!history || history.length === 0) {
        return (
            <div className="search-history">
                <div className="history-header">
                    <h3>Recent Searches</h3>
                </div>
                <p className="history-empty">No recent searches yet. Search for a city!</p>
            </div>
        );
    }
    // else returns active searches - with clearing, selecting, and removing entires
    return (
        <div className="search-history">
            <div className="history-header">
                <h3>Recent Searches</h3>
                <button
                    onClick={onClearHistory}
                    className="clear-history-btn"
                    title="Clear all History"
                    
                >
                    Clear All
                </button>
            </div>


            <div className="history-list">
                {/* Map Over History Array */}
                {history.map((item,index) => (
                    <div key={index} className="history-item">
                        <button
                        className="history-item-button"
                        onClick={() => onSelectCity(item.city)}
                        title={`Search for ${item.city} again`}
                        >
                            <div className="history-item-main">
                                <div className="history-item-info">
                                    <span className="history-city">{item.city}</span>
                                    <span className="history-country">{item.country}</span>
                                </div>
                                <div className="history-item-weather">
                                    <span className="history-temp">{Math.round(item.temp)}</span>
                                    <span className="history-weather">{item.weather}</span>
                                </div>
                            </div>
                            <span className="history-time"> {formatRelativeTime(item.timestamp)}</span>
                        </button>

                        <button
                            className="history-remove-btn"
                            onClick={(e) => {
                                // Stops the affection of other elements upon deletion of another
                                e.stopPropagation();
                                onRemoveCity(item.city);
                            }}
                            title="Remove From History"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
// export SearchHistory
export default SearchHistory;