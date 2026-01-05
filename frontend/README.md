# Weather Dashboard - Frontend

React + Vite frontend application consuming the backend API.

## Tech Stack

**React 19.2.3** - UI Library
**Vite** - Build tool and dev server
**Axios** - Http client for API communication
**JavaScript**

## prerequisites

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

Create '.env' file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Note** Vite requires VITE\_ prefix for environment variables

## Development

```bash
npm run dev
```

Frontend runs on 'https://localhost:5173'

## Project Strucuture

```
weather-app
├──frontend
│   ├──public
│   │   └──vite.svg
│   ├──services
│   │   └──api.js
│   ├──src
│   │   ├──assets
│   │   │   └──react.svg
│   │   ├──components
│   │   │   ├──CacheIndicator.jsx
│   │   │   ├──CacheManager.jsx
│   │   │   ├──LoadingSpinner.jsx
│   │   │   ├──README.md
│   │   │   ├──SearchHistory.jsx
│   │   │   ├──WeatherDisplay.jsx
│   │   │   └──WeatherMapData.jsx
│   │   ├──style
│   │   │   ├──CacheIndicator.css
│   │   │   ├──CacheManager.css
│   │   │   ├──LoadingSpinner.css
│   │   │   ├──SearchHistory.css
│   │   │   └──WeatherDisplay.css
│   │   ├──utils
│   │   │   ├──cache.js
│   │   │   ├──defensive.js
│   │   │   ├──README.md
│   │   │   ├──searchHistory.js
│   │   │   └──validation.js
│   │   ├──App.css
│   │   ├──App.jsx
│   │   ├──index.css
│   │   └──main.jsx
│   ├──.vite
│   │   └──deps
│   │   │   ├──_metadata.json
│   │   │   ├──axios.js
│   │   │   ├──axios.js.map
│   │   │   ├──chunk-HKJ2B2AA.js
│   │   │   ├──chunk-HKJ2B2AA.js.map
│   │   │   ├──chunk-YVZCJCRU.js
│   │   │   ├──chunk-YVZCJCRU.js.map
│   │   │   ├──package.json
│   │   │   ├──react-dom_client.js
│   │   │   ├──react-dom_client.js.map
│   │   │   ├──react.js
│   │   │   └──react.js.map
│   ├──eslint.config.js
│   ├──index.html
│   ├──package.json
│   ├──README.md
│   ├──vite.config.js
│   ├──.env.example
│   └──.gitignore
├──CONTRIBUTING.md
├──README.MD
└──.gitignore
```

## API service layer

All backend communication goes through 'src/services/api.js

## Functions

```javascript
import { checkHealth, getWeather, validateConnection } from "./services/api";

const healthResult = await checkHealth();
//returns {success: Boolean, data?: {...}, error? {...}}

const weatherResult = await getWeather("London");
//returns {success: boolean, data?: {current, forecast}, error?: {...}}

const validateResult = await ValidateConnection();
//returns {health {...}, weather: {...}, overall: Boolean}
```

## Testing

### Manual Tests

1. **Backend Communication**:
   - Open 'http://localhost:5173'
     -Verify Backend Connected message
   - Check console for successful health check
2. **Weather Search (demo Mode)**
   Search: London: -> Should display weather data
   Search Tokyo: -> Should display weaather data
   Search: Paris: -> Should show 404 error

3. **Error Handling**
   -Stop backend server
   - Refresh page
   - Should show connection error
   - Search button should be disabled
4. **Console Logs**
   - All requests should log to console
   - Response data should be visable
   - Errors should show full details

## Development Phases

### Phase 4 Frontend Foundation (Completed) [x]

- Vite + React setup
  = API service layer
- backend communication
- basic UI for testing
- Health check display
- Weather Search
- Error handling
- Console logging

### Phase 5 Weather UI Logic (Completed) [x]

- Search validation
- Loading states
- Data transformation
- Defensive rendering
- Chache management

### Phase 6 Visualization (Completed) [X]

- Leaflet maps
- Weather icons
- Responsive design

## Technical Challenges & Solutions

### Challenge: React 19 Compatibility\*\*

#### Problem

This project was initially set up with React 18 patterns, accidently downloaded React 19, due to not restricting installation version

#### Error

‘Cannot read properties of undefined (reading ‘createElement’)
Root Cause
React 19 changed JSX transform imports
React 18: import React from ‘react’;
React 19: import { StrictMode } from ‘react’;

#### Solution

Update all import to React 19 syntax: Always check major version changes when using new version of tools or frameworks.
What I learned
React 19 is relatively new and documentation may still derive form React 18 patterns.

### Challenge: Git Branch Divergence

#### Problem

Local and remove branches diverged after multiple commits, and my push was rejected

#### Error

`! [rejected] main -> main (not-fast-forward)`

#### Root Cause

I made direct changes to main within GitHub and when it tried to push main from my remote branch this error occurred.
Solution
Git fetch origin
Git rebase origin/main
Git push –force
What I learned:
Using pull requests can avoid direct main branch conflicts; feature branches merge cleanly when rebased.

### Challenge: CORS and DOTENV Errors during development

#### Problem

1. CORS: Frontend could not access backend api initially.
2. DOTENV: Environment variables were not being loaded.

#### Error

1.  Access to XMLHttpRequest blocked by CORS policy.
2.  Reference Error: require is not defined in ES module scope.

#### Solutions

1. Adding CORS middle ware to Express.js application.
   a. app.use() -> app.use(cors({ origin: ‘http://domain.com@ }));
2. Refactoring from dotenv.config() to import ‘dotenv/config. dotenv.config() is a CommonJS is executed on-line. ‘dotenv/config’ loads on demand.

##### What I Learned

1.  CORS is browser security feature with determines what domains can access the resources.
2.  CommonJS is an older JavaScript module system, loading one-by-one. ESM module is a more modern, and standard in web development, loading asynchronously, allowing for browsers to fetch many files at once without freezing.

# Cors Error

1. Verify backend
2. Check backend has cors() middleware
3. Verify 'VITE_API_BASE_URL' matches backend URL

### Network Errors

1. Check bacned is running 'curl http://localhost:5000/api/health'
2. Verify firewall isnt blocking localhost connectins
3. Check Port is clear. netstat -ano | findstr :5173
   4 Check console for errors

### Environment Variables not working

1. Ensure '.env' file exists in 'frontend/ directory
2. verify variable has VITE prefix
3. Restart dev server (vite loads .env at startup)
