# Utility Functions Documentation

This Directory contains reusable utility functions for data validation, cahcing, search history, and defensive rendering.

## 'validation.js'

### Functions

### 'validateCityInput(input)'

validates and sanitizes city name input

**Parameters**

- 'input' (string) - Raw User Input

**Returns**

- Object: { IsValid: boolean, sanitized: string, error, string|null}

**Validation Rules**

- Minumun Length: 2 Characters
- Maximum Length: 50 Characters
- Allowed Characters: letters and spaces
- No Consecutive Spaces
- Trim whitespaces

**Example**

```javascript
const result = validateCityInput(" Londond ");
//{  isValid: true, sanitized: 'L', error: null}

const result = validateCityInput("L");
// { isValid: false, sanitized: 'L' error: City must be at least 2 characters long}
```

### 'formatCityName(city)'

Formats city name with proper capitalization

**Parameters**

- 'city' (string) - city name to format

**Returns**

- string - Capitalized city name

**Example**

```javascript
formatCityName("new york"); // New York
formatCityName("LONDON"); // London
```

### 'getInputSuggestion(city)'

Suggests corrections for common misspellings

**Parameters**

- 'city' (string) - City city name to check

**Returns**

- Object '{suggestion: string|null, reason: string|null}'

**Example**

```javascript
getInputSuggestion("Londn");
// { suggestion: "London", reason "Did you mean this?"}
```

---

## 'searchHistory.js'

Manages Search History persistence using localStorage

### Configuration

- **Storage Key** 'weather_search_history'
- **Maximum items** 10 most recent searches

### Functions

### 'getSearchHistory()'

Retrieves all search history from localStorage

**Returns**

- Array of history objects

**Structure**

```javascript
[
  {
    city: "London",
    country: "GB",
    timestamp: 1703779200000,
    temp: 8.5,
    icon: "01d",
  },
];
```

### 'addtoSearchHistory(cityName, weatherData)'

Adds or updates a city in search history.

**Parameters**

- 'cityName' (stirng) - City name
- 'weatherData' (object) - Full weather Response

**Returns:**

- Array - Updated History

**Behaviour**

- Adds to beginning of array
- Updates existing entry if city already exists
- Maintains maximum of 10 items
- Auto-trims oldest entries

### 'removeFromSearchHistory(cityName)'

Removes a Specific city from history

**Parameters:**

- 'cityName - (string) - City to remove

**Returns**

- Array - Updated history

### 'clearSearchHistory()

Removes all search history

**Returns**

- Array - empty Array

### 'formatRelativeTime(timestamp)

convert Unix timestamp to human-redable relative time

**Parameters**

- 'TimeStamp' (number) - unix timestamp in miliseconds

**Returns**

- string - relative time string

**Example**

```javascript
formatRelativeTime(Date.now() - 30000);
formatRelativeTime(Date.now() - 300000);
formatRelativeTime(Date.now() - 7200000);
```

---

## 'cache.js'

Implements response caching to reduce API calls.

### Configuration

- **Cache Duration** 20 minutes (1,200,000ms)
- **Storage Key Prefix** 'weather*cache*'

### Functions

#### 'getCachedWeather(city)'

Retrieves cached weather data for a city.

**Parameters**

- 'city' (string) - City Name

**Returns**

- Object or null: '{data, timestamp, age, fromCache:true}' or 'null if not found/expired'

**Behaviour**

- Returns null if cache expired
- Auto Removes Expired Entries
- Logs Cache miss and hit

#### 'setCachedWeather(City, data)'

Stores Weather Data in cache

**Parameters**

```javascript
setCachedWeather("Londond", {current {...}, forecast {...}});
```

#### 'Remove Cached Data for a Specific City

-Not Implemented But present and works when mounted to frontend

#### 'clearAllCache()'

Removes all cached weather data

**Returns**

- number - count of cleared entries

#### 'getAllCachedCities()'

gets metadata for all cached cities

**Returns**

- Array of objects

```javascript
[
  {
    city: "london",
    timestamp: 1703779200000,
    age: 120000,
    isExpired: false
  {
]
```

#### 'formatCacheAge(age)'

formats cache age in milliseconds to human-readable string.

**Parameters**

- 'age' (number) - Age in milliseconds

**Returns**
-string - Formatted Age

**Examples**

```javascript
formatCacheAge(5000); /// 5 seconds
formatCacheAge(125000); /// 2 Minutes 5s econds
formatCacheAge(3720000); // 1 Hours 2 Minutes
```

#### 'getCacheStats()

Returns cache statistics

**Returns**

```javascript
{
    total: 5,
    valid: 3,
    expired: 2,
    duration: 1,200,000,
    DurationMinutes: 20
}
```

---

## 'defensive.js

Provides Defensive Rendering utilites to prevent crashing from missing or malformed data.

### Function

#### 'safeGet(obj, path, fallback = 'N/A)'

safely accesses nested object properties

**Parameters**

- 'obj' (object) - Object to access
- 'path (string) - Dot-notation path
- 'fallback' (any) - fallback value if path doesnt exist

**Returns**

- Value at path or fallback

**Example**

```javascript
const data = { current: { main: { temp: 8.5 } } };
safeGet(data, "current.main.temp", "N/A");
safeGet(data, "current.main.humidity", "N/A");
```

#### 'validateWeatherData(data)'

Validates weather data structure.

**Parameters**

- 'data' (object) - Weather data to validate

**Returns**

- Object: '{ isValid: boolean, errors: Array, warnings: Array, data}

**Checks**

- Top-level Structure (current, forecast)
- Requried fields existence
- Array validity
- Nested Properties

**example**

```javascript
const result = validateWeatherData(weatherData);
if (!results.isValid) {
  console.error(`invalid Data:', result.errors`);
}
```

#### 'formatTemperature(temp)'

Formats temperature with fallback

**Parameters**

- 'temp' (number) - Temperature in celsius

**Returns**

- String - Formatted Temperature or 'N/A'

**Example**

```javascript
formatTemperature(8.5); // "9C"
formatTemperature(null); // N/A
formatTemperature(undefined); // 'N/A'
```

#### 'formatWindSpeed(speed)

Formats wind speed with fallback

**Parameters**

- 'speed' (number) - speed in M/S

**Returns**

- string - Formatted speed or 'N/A'

#### 'formatHumidity(humidity)'

Formats humidity percentage with fallback

**Parameters**

- 'humidity'' (number) - Humidity Percentage

**Returns**

- String - Formatted Humidity or 'N/A'

#### 'getWeatherIcon(iconCode)'

Gets Weather icon URL or fallback Emoki.

**Paramters**

- 'iconCode' (string) - OpenWeather icon code

**Returns**

- string - Icon URL or emoji fallback

#### 'safeArray(arr, maxLength = 100)'

Validates and sanitizes array data

**Parameters**

- 'arr' (any) - Value to validate as array
- 'maxLength' (number) - Maximum allowed length

**Returns**

- Array - Vali array or empty array

**Behaviour**

- Returns empty array if not an array
- Truncates if exceeds MaxLength
- Logs Warnings

---

## Common Patterns

### Error Handling

Most utils use try/catch and log errors to console.

```javascript
try {
} catch (error) {
  console.error(`[UTILITY_NAME] ERROR:' , error`);
  return fallbackvalue;
}
```

### Logging Conventions

All Console Logging is Titled

```javascript
console.log(`[CACHE] Hit:` London)
console.warn(`[DEFENSIVE] Missing Field: Temperature`)
console.error(`[VALIDATION] Invalid Input`)
```

### Defensive Patterns

1. Provide fallback values
2. Validate before processing
3. Handle null/undefined gracefully
4. Log warnings for missing data
5. Never crash the application with malformed or missing data.
