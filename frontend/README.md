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


**Note** Vite requires VITE_ prefix for environment variables


## Development
```bash
npm run dev
```


Frontend runs on 'https://localhost:5173'


## Project Strucuture
frontend/
├── src/
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── index.html               # HTML entry point
├── package.json
├── vite.config.js           # Vite configuration
└── README.md

## API service layer

All backend communication goes through 'src/services/api.js


## Functions
```javascript

import { checkHealth, getWeather, validateConnection} from './services/api';



const healthResult = await checkHealth();
//returns {success: Boolean, data?: {...}, error? {...}}


const weatherResult = await getWeather('London');
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


### Phase 6 Visualization (Completed) [Z]
- Leaflet maps
- Weather icons
- Responsive design


## Troubleshooting


### Cors Error

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
