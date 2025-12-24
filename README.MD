# Weather dashboard

This is a full-stack weather application displayting weather and 5 day forecast using the OpenWeather API.

## Architecture

weather-dashboard/
├── .gitignore
├── README.md
├── CONTRIBUTING.md
└── backend/
    ├── .env.example (template)
    ├── .gitignore
    ├── package.json
    ├── README.md
    ├── server.js
    ├── data/
    │   ├── README.md
    │   ├── demo-current-london.json
    │   ├── demo-current-tokyo.json
    │   ├── demo-forecast-london.json
    │   └── demo-forecast-tokyo.json
    ├── docs/
    │   └── API_CONTRACT.md
    ├── routes/
    │   └── weather.js
    ├── services/
    │   └── weatherService.js
    ├── test-parity.js

## Tech Stack

**backend**

- Express.js -- HTTP server
- Axios -- HTTP client for OpenWeatherAPI
- dotenv - Environment variable management
- CORS - Cross-origin resource sharing

**frontend**

- React - UI framework
- VITE - build tool
- AXIOS - HTTP client for backend communication
- Chart.js - Forecast visualization
- Leaflet - Interactive Maps.

## Features

- Current Weather Conditions (temperature, humidity, wind)
- 5-day forecast with 3 hour intervals
- interactive location maps
- temperature trend visulization
- Demo mode for development without API CALLS
- API key protection (backend-only)

## prerequisites

- Node.js 18+ and npm
- OpenWeatherAPI key

## Quick start

### 1. Clone and instll

```bash
git clone
cd WEATHER-APP

cd backend
npm install

cd.. --- directs to root of application.

OR

cd ../frontend --- directs to frontend sub-folder
npm install
```

### 2. Configure Backend

Create 'backend/.env:

```bash
in .env
PORT=5000
USE_DEMO_DATA = true || false
API_KEY= your_api_key_here
```

**get api key:**

1. Sign up at https://openweathermap.org/api
2. Generate free api key
3. Wait 10 minutes for activation
4. add to '.env'

### .3 Start backend

```bash
cd backend
npm run dev
```

server runs on 'http://localhost:5000'

**test health check:**

```bash
curl http://localhost:5000/api/health
```

**test weather endpoint:**

```bash
curl "http://localhost:5000/api/weather?city=London"
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: "http://localhost:5173"

## Environment Modes

### Demo Mode development

```bash in .env
USE_DEM_DATA=true
```

- Uses local JSON files
- NO API calls to OpenWeather
- No API key required
- instant responses
- consistent data for testing

### live Mode (production)

```bash in /env
USE_DEMO_DATA=false
```

-calls OpenWeather API

- Requires a valid API KEY
- Real-time data
- Subject to rate limits

**switch modes** Change '.env' and restart backend. Frontend requires no change.

##API Endpoints

## Health Check

```bash

GET /api/health
```

**RESPONSE**

```json
{
  "status": "ok",
  "timestamp": "2025-12-13T10:30:00.000Z",
  "mode": "demo",
  "server": "weather-dashboard-backend"
}
```

### Get Weather Data

```bash


GET /api/weather?city={cityName}



**Parametrs**
- City (required) - City Name (e.g, "Tokyo", "London", "New York")

```

**Success Response (200)**

```json If i return browser data it would be thousands of lines so take my word for it.
[WEATHER REQUEST] { city: 'London' }
[CURRENT WEATHER REQUEST] {
  city: 'London',
  url: 'https://api.openweathermap.org/data/2.5/weather'
}
[FORECAST REQUEST] {
  city: 'London',
  url: 'https://api.openweathermap.org/data/2.5/forecast'
}
[CURRENT WEATHER RESPONSE] { city: 'London', temp: 7.01, status: 200
}
[FORECAST RESPONSE] { city: 'London', count: 40, status: 200 }
[WEATHER RESPONSE STRUCUTRE] {
  hasCurrent: true,
  hasForecast: true,
  currentTemp: 7.01,
  forecastCount: 40
}
```

**error Response (404)**

```json
{
  "error": "City Not Found",
  "city": "ival",
  "message": "Please Check the City name and try again"
}
```

## Development Cycle

### Phase 1: Backend Foundation (Completed) [x]

- Express server setuo
- Health check enpoint
- Environment Configuration

### Phase 2: Weather API Gateway (Completed) [x]

- OpenWeather API Intergration
- Combined Current + forecast endpoint
- Error handling

### Phase 3: Demo Data Mode (Completed) [x]

- Local JSON files for development
- Mode Switching without code changes

### Phase 4: Frontend Foundation (In Development) [o]

- React + Vite setup
- API service layer
- backend connection

### Phase 5: Weather UI Logic (To Do) []

- Search functionality
- Data validation
- Display Weather Information

### Phase 6: Visualisation

- Chart.js temperature trends
- Leaflet Map intergration

# Project Structure (Detailed)

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
    =README.md       # Backned Specifications doc
    =server.js       # Entry Point
    ===frontend/
    ------------ src/
        --------components/     #React Componenets
        --------services        # API client Layer
        -App.jsx
        -Main.js
    =.env           # Frontend environment variable
    =package.json
    =README.md      # Frontend Specifications
```

# Testing

## Backend Tests

```bash
 # Health Check
 curl  "http://localhost:5000/api/health"



 # Weather endpoint (livemode)
 curl "http://localhost:5000/api/weather?city=London"

 # Error Handling
 curl "http://localhost:5000/api/weather" # missing city

 curl "http://localhost:5000/api/weather?city=InvalidCity123" # Not Found

```

# TroubleShooting

- Check Node.js version : 'node -v (requires 18+)
- Verify '.env' file exists in 'backend/' directory
- check port 5000 isnt in use: 'lsof -i :5000'

## 401 Authentication Error

- Verify your api key is correct in '.env'
- check API key is activated
- Test api key directly: 'curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"'

## 404 City not found

- Check city name spelling
- Try Major Cities first ( London, Tokyo, Paris)
- Use English City names

## Cors error in browser

- Verify backend is running on the correct port
- Check cors is enabled in 'server.js
- Verify frontend is calling correct backend URL

# Contribution

1. Each Phase must pass all tests
2. Log all API requests, responses during development
3. Never commit '.env' file as people can exhause your limit; Worse cost you money.
4. test both demo and live modes throughout - Data must be strucutred adjacent to OPWAI
5. Document breaking changes in API Contract

# License

MIT

# Contact

For questions, ask directly, or open a GITHUB issue.
