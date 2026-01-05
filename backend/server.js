import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weather.js';


// Create Express application
const app = express();
// Establish SERVER_PORT
const SERVER_PORT = process.env.PORT || 5000;


// Middleware - Cors applies a content-type, only accepting requests from identifiable urls. 
// Json, is somewhat similar. ensuring the "application/" parameter mathces with application/json
app.use(cors({
    origin: process.env.FRONT_END_URL
}));
app.use(express.json());


// Health Check - Api endpoint to end response detailing health, time, dataMode boolean, servername and a 
// api configuration boolean
app.get('/api/health', (req, res) => {
    const response = {
        Health: "ok",
        Time: new Date().toISOString(),
        Data_Mode: process.env.USE_DEMO_DATA === 'true' ? 'demo' : 'live',
        Server_Name: "Weather-dashboard-backend",
        "apiKeyConfigured": process.env.API_KEY ? true : false
    };

    // Log for debugging
    console.log('[HEALTH CHECK]', response);
    // Response
    res.json(response);
});

// Mount Weather Routes
app.use('/api/weather', weatherRoutes);




// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});


// Start Server
app.listen(SERVER_PORT, () => {
    console.log(`Server Running on http://localhost:${SERVER_PORT}`);
    console.log(`MODE: ${process.env.USE_DEMO_DATA === 'true' ? 'demo' : 'live'}`);
    console.log(` API Key: ${!!process.env.API_KEY ? 'Configured' : 'MISSING'}`);
});