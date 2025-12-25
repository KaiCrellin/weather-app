# Weather Dashbaord - backend

Express.js API server that proxies requests to OpenWeather API and provides Weather and Forcast data to the frontend

## Architecture principles

1. **API Gatepay Pattern** Backend is the only service that communicated with OpenWeahter
2. **Environment-based modes** switch between demo and live data via 'USE_DEMO_DATA'
3. **Data Contract stability** Frontend expects same response shape regardless of mode
4. **Defensive Logging** All requests/responses logged for debugging

## instillation

Create '.env' file:

```env
SERVER_PORT=5000
USE_DEMO_DATA=false
API_KEY=YOUR_KEY_HERE
```

**Variables**

- 'SERVER_PORT' - Server PORT
- 'USE_DEMO_DATA' - 'true' for demo mode, 'false' for live API
- 'API_KEY' - your OpenWeather API key

##scripts

```bash
npm start ### PRODUCTION
npm run dev ### DEVELOPMENT - AUTO RESTART NODEMON
```

## API Endpoints

### GET /api/health

**Response**

```json
[HEALTH CHECK] {
  Health: 'ok',
  Time: '2025-12-13T21:33:03.703Z',
  Data_Mode: 'live',
  Server_Name: 'Weather-dashboard-backend',
  apiKeyConfigured: true
}

```

### GET /api/weather?city={cityName}

**parameters**

- 'city (string, requried) - City name

**Success Response (200):**

```json
{
    "current": { OpenWeather current weather data},
    "forecast": { OpenWeather forecast data},
}
```

**Error Response**

- '400' - Missing City Parameter
- '404' - City is not found
- '500' - Server or API Errror

## Project Structure

```
WEATHER-APP/
    ===backend/
    ----------- routes/
            -weather.js    # Weather endpoint handler
    ----------- services/
            -weatherService.js  # Open API Intergration
    ----------- data/           # Demo Mode JSON files
            -demo-current-london.json
            -demo-forecast-london.json
    ----------- docs/
            -API_CONTRACT.md    # API documentation
    =.env               # Environment variables
    =.env.example       # Environment example
    =package.json
    =Package-lock.json
    =README.md       # Backned Specifications doc
    =server.js       # Entry Point
```

## Development Workflow

### 1. Start Server

```bash
npm run dev
```

### 2. Verify Health

```bash
curl "http://localhost:5000/api/health"
```

**Expected Response** ## Health, Time. Data_mode, Server-name and apikeyconfigured

```bash
curl "http://localhost:5000/api/weather?city=London"

```

**Expected Response:** ## Combined current + forecast JSON

### 4. Check Logs

Server logs all requests:

```
[WEATHER REQUEST] { city: 'London' }
[CURRENT WEATHER REQUEST] { city: 'London', url: '...' }
[FORECAST REQUEST] { city: 'London', url: '...' }
[CURRENT WEATHER RESPONSE] { city: 'London', temp: 8.5, status: 200 }
[FORECAST RESPONSE] { city: 'London', count: 40, status: 200 }
```

## Mode Switching

### Demo Mode

```env
USE_DEMO_DATA=true
```

**Benefits**

- NO API CALLS (zero cost)
- instant responses
- consistent test data
- Works offline

**data Soruce:** 'demo/demo-\*.json' files

### Live Mode

```env
USE_DEMO_DATA=false
```

**Benefits**

- Real-time Weather data
- Current Conditions
- Accurate Forecasts

**Requriements**

- valid OpenWeather API Key
- Internet Connection
- Within Rate Limit (1,000/day free limit)

**restart server after changing nodes**

## Error Handling

### Missing City parameter

```bash
curl "http://localhost:5000/api/weather
```

response: "400 bad request"

### Invalid City

```bash
curl "http://localhost:5000/api/weather?city=InvalCity"
```

response: '404 Not Found'

### Invalid API Key

response: ' 401 Internal Server Error'
logs: full error details

### OpenWeather API Down

response: '500 Internal Server Error'
Logs: full error details

## OpenWeather Intergration

### Endpoints Used

1. **Current Weather**

```
    GET https://api.openweathermap.org/data/2.5/weather
    params: q={city}, appid:{key}, units=metirc
```

2. **5-Day forecast:**

```
    GET https://api.openweathermap.org/data/2.5/forecast
    params: q={city}, appid-{key} units=metric
```

# WHY Two calls?

OpenWeather does not provide a combined weather endpoint. So we must combine then using Promise.all() for parallel execution.

### Response Combination

```javascript
{
    current: { from /weather endpoint},
    forecast: { from forecast endpoint}
}
```

frontend will recieve this exact strucutre regardless of demo/live mode.

# Rate Limiting

**Free Tier Limits**

- 1,000 calls a day
- 60/calls/ minute

**Current Usage**

- 2 API calls per city search ( current + forecast)
- ~500 city searches per day max

**Recommendations**

- Use Demo Mode during development
- Implement Frontend caching

# Security

## API key protection

- never expose your API to frontend
  = Store in '.env' (gitignored)
- backend-only access

## CORS Configuration

```javascript
app.use(cors());
```

**production** Restict to frontend domain:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-domain.com",
  })
);
```

# Testing

```bash
# Health check
curl "http://localhost:5000/api/health"

# Valid city
curl "http://localhost:5000/api/weather?city=London"

# Invalid city
curl "http://localhost:5000/api/weather?city=XYZ123"

# Missing parameter
curl  "http://localhost:5000/api/weather"
```

**Test Coverage goals**

- [x] Health Check endpoint returns correct strucutre
- [x] Weather endpoint validates city parametr
- [x] Error handling for all failure modes
- [] Demo Mode returns correct data
- [x] Live Mode calls OpenWeather Correctly

## Server won't start

- Check `.env` file exists
- Verify Node.js version: `node -v` (need 18+)
- Check port 5000 availability: `lsof -i :5000`

## "OPENWEATHER_API_KEY not configured"

- Verify `.env` file is in `backend/` directory
- Check variable name spelling
- Ensure no spaces: `OPENWEATHER_API_KEY=abc123` not `OPENWEATHER_API_KEY = abc123`

## 401 from OpenWeather

- API key not activated yet (wait 10 minutes)
- Invalid API key
- Test directly: `curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"`

## Module not found errors

```bash
rm -rf node_modules package-lock.json
npm install
```

# Logging

All Loging is prefixed for easy filtering:
[HEALTH CHECK] - Health endpoint called
[WEATHER REQUEST] - Weather endpoint called
[CURRENT WEATHER REQUEST] - Calling OpenWeather current endpoint
[CURRENT WEATHER RESPONSE] - Response received
[FORECAST REQUEST] - Calling OpenWeather forecast endpoint
[FORECAST RESPONSE] - Response received
[WEATHER SERVICE ERROR] - Error in weather service

# Dependencies

```json
    "dependencies": {
    "axios": "^1.13.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1"
    },
```

**\*dev dependencies**

```json
"devDependencies": {
    "nodemon": "^3.1.11"
  }
```
