# Component Documentation

React Componenets for the Weather Dashboard Application

---

## Core Componenets

### 'LoadingSpinner

Reusable Loading indicator with overlay support

**Props**

- 'show' (boolean) - Whether to show the spinner
- 'message' (string, optional) - Loading message {default: 'Loading...}
- 'overlay' (boolean, optional) - Show fullscreen overlay (default: false)

**Variants**

1. **overlay Mode** Fullscreen with backdrop blur
   .2 **Inline Mode** Embedded in componenet

**Usage**

- Overaly Spinner (blocks entire screen)
- Inline Spinner (displayed inside Search button)

**Styling**

- 50px H 50px W for overlay mode
- Inline Remove H and W and display block - should work
- Blue accent Color #3498db
- Smooth rotation animation (0.8s linear)

---

### 'SearchHistory.jsx'

Displays and manages Search Histroy

**Props**

- 'history' (Array) - Array of search history items
- 'onSelectCity' (function) - Callback when city clicked
- 'onRemoveCity' (Function) - Callback when city removed
- 'onClearHistory' (Function) - Callback to clear all history

**Histroy Item Structure**

```json
{
  "city": "London",
  "country": "GB",
  "timestamp": 1703779200000,
  "temp": 8.5,
  "weather": "clear",
  "icon": "o1d"
}
```

**Features**

- Dispalys up to 10 most recent searches
- Shows City, Country, Temperature, weather condition
- Relative Timestamps
- Remove Individual Buttons
- Clear all with window confirmation
- Empty State Message

**Usage**

```jsx
<SearchHistory
  history={searchHistory}
  onSelectCity={handleHistorySelect}
  onRemoveCity={handleRemoveFromHistory}
  onClearHistory={handleClearHistory}
/>
```

---

### 'CacheIndicator.jsx'

Shows when data is from cache with refresh option

**Props**

- 'fromCache' (boolean) - Whether data is cahced
- 'age' (number) - Cache age in milliseconds
- 'onRefresh' (Function) - Callback to refresh data

**Features**

- Only displays if 'fromCache is true
- Shows cache age in human-readable format
- Refresh button to fetch fresh data
- Loading states during refresh
- Yellow banner for cached data

**Usage:**

```jsx
<CacheIndicator
  fromCache={cacheInfo?.fromCache}
  age={cacheInfo?.age}
  onRefresh={handleRefresh}
/>
```

**Visual States**

- Hidden when data is fresh
- Yellow banner when data is cached

---

### 'CacheManager.jsx'

Manages and displays cache statistics

**Props** None (self-contained)

**Features**

- Exandabl/collapsible panel
- Cache statistics (total, valid, expired, duration)
- list of all cached cities with ages
- Clear all cache button with confirmation
- Loading state during clear operation
- Auto-refreshes on mount

**Statistics Displayed**

- Total Cached: Total Number of Cached Cities
- Valid: non-expired Caches
- Expired: Chaces past 20-minute TTl
- Duration: Cached lifetime (10m)

**Usage**

```jsx
<CacheManager />
```

**Internal Behaviour**

- Calls 'getAllCachedCities()' on mount
- Calculates stats using 'getCacheStats()'
- Refreshes after clear completes

---

### 'WeatherDisplay.jsx'

Displays weather data with defensive rendering.

**Props**

- 'weatherData' (object) - Weather data object containing 'current and 'forecast'

**Features**

- Defensive Rendering (handles missing data gracefully)
- Weather Icon Display with error handling
- Current Weather sections with 6 data points
- Forecast preview ( 6 Entries)
- Expandable Raw Data View
- Formatted values for fallback

**Current Weather Fields**

- Temperature
- Feels Like
- Condition
- Description
- Humidity
- Wind speed

**Forecast Fields**

- Time/Date
- Temperature
- Weather Condition
- Weather icon

**usage**

```jsx
<WeatherDisplay weatherData={weatherData} />
```

**Defensive Features**

- Uses 'safeGet()' for all data access
- formatters for temperature, wind, humidity
- Handles missing weather icons
- Shows "N/A" for missing fields
- Validates arrays before mapping
- Never crashes on malformed data

---

### 'WeatherMapData.jsx'

Provides an interactive geographic visualization of the weather location using react-leaflet

**Props**

- 'weatherData' (object) - Weather data object containing coordinates, system info, and current conditions

**Features**

- Interactive map
- Auto Recenter - Custom RecenterMap hook that uses flyTo for smooth transitions between coordinates
- Rich popup - displated detailed summary of weather conditions at the marker location
- Defensive Data Handling: Prevents crashes using 'safeGet()' for properties

**Current Weather Fields (Map Popup)**

- City Name
- Country Code
- Weather Condition
- Weather Description (e.g cloud, rain)
- Temperature (formatted)
- feels Like (Raw)
- Humidity (formatted)
- Wind Speed (formatted)

**Usage**

```jsx
<WeatherMap weatherData={weatherData}>

```

**Defensive Features**

- Fallback coordinates - Defaults to 0,0 if latitude or longitutde are missing
- Safe Extraction uses safeGet() to navigates deep objects without throwing undefined or NaN erros
- formatted fallbacks - using 'formatTemperature(), formatHumidity()' to ensure unit consistency and handle null values
- Default Strings - Display "Unknown" or "??" for missing metadata like country codes and descriptions

## Componenet Organization

### Directory Structure

/Componenets(
CacheIndicator.jsx
CacheManager.jsx
LoadingSpinner.jsx
SearchHistory.jsx
WeatherDisplay.jsx
WeatherMapData.jsx
)
/styles(
CacheIndicator.css
CacheManager.css
LoadingSpinner.css
SearchHistory.css
WeatherDisplay.css
WeatherMapData.css
)

### Naming Conventions

- PascalCase for component files
- Matching css file to each componenet
- Descriptive, self-documenting names

### Component Patters

#### State Management

Components use React Hooks

```jsx
const [isLoading, setIsLoading] = useState(false);
```

#### Event handling

Consistent Naming:

```jsx
const handleClick= () => {...}
const handleSubmit = (e) = { e.preventDefault();}

```

### Conditional Rendering

Early returns for clarity

```jsx
if (!data) return null;
if (loading) return;
return;
```

---

### CSS Organization

Each Component has its own CSS Files

- Scoped class names ('.content-name')
- Mobile responsive design

### Common Classes

```css
.btn-primary .btn-secondary .loading-spinner .error-message;
```

### Semantic HTML

- '<button>' for actions
- '<details>' for exapndable sections
- '<summary>' for heading

## Performance Consideration

### Optimization Techniques

1. Debouncing - input validationd debouce 300ms
2. Lazy Loading - Componenets load on demand
3. Efficient Rendering - Conditional rendering prevetns unnecessary updates
