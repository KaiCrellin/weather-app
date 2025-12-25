import 'dotenv/config';
import { getWeatherData } from './services/weatherService.js';
console.log(`DEBUG: Current directory`, process.cwd());
console.log(`DEMO DATA:`, process.env.USE_DEMO_DATA);

async function testParity() {
    console.log('\n=== Testing Demo/Live Parity ===\n');

    const city = 'London';


    try {
        // Get data using current mode
        const data = await getWeatherData(city, process.env.API_KEY);
        const mode = process.env.USE_DEMO_DATA === 'true' ? 'demo' : 'live';

        console.log(`Mode: ${mode}`);
        console.log(`City: ${data.current.name}`);
        console.log(`\nCurrent Weather Fields Present:`);

        const currentFields = [
            'coord.lat',
            'coord.lon',
            'weather[0].id',
            'weather[0].main',
            'weather[0].description',
            'weather[0].icon',
            'main.temp',
            'main.feels_like',
            'main.temp_min',
            'main.temp_max',
            'main.pressure',
            'main.humidity',
            'visibility',
            'wind.speed',
            'wind.deg',
            'clouds.all',
            'dt',
            'sys.country',
            'sys.sunrise',
            'sys.sunset',
            'timezone',
            'id',
            'name',
            'cod'
        ];

        currentFields.forEach(field => {
            const parts = field.split(/[\.\[\]]+/).filter(Boolean);
            let value = data.current;

            for (const part of parts) {
                value = value?.[part];
            }

            const present = value !== undefined && value !== null;
            console.log(`  ${present ? 'Y' : 'N'} ${field}: ${present ? 'PRESENT' : 'MISSING'}`);
        });

        console.log(`\nForecast Fields Present:`);

        const forecastFields = [
            'cod',
            'message',
            'cnt',
            'list',
            'city.id',
            'city.name',
            'city.coord.lat',
            'city.coord.lon',
            'city.country',
            'city.timezone',
            'city.sunrise',
            'city.sunset'
        ];

        forecastFields.forEach(field => {
            const parts = field.split(/[\.\[\]]+/).filter(Boolean);
            let value = data.forecast;

            for (const part of parts) {
                value = value?.[part];
            }

            const present = value !== undefined && value !== null;
            console.log(`  ${present ? 'Y' : ' N'} ${field}: ${present ? 'PRESENT' : 'MISSING'}`);
        });

        console.log(`\nForecast List Item Fields (First Entry):`);

        const listItemFields = [
            'dt',
            'main.temp',
            'main.feels_like',
            'main.temp_min',
            'main.temp_max',
            'main.pressure',
            'main.humidity',
            'weather[0].id',
            'weather[0].main',
            'weather[0].description',
            'weather[0].icon',
            'clouds.all',
            'wind.speed',
            'wind.deg',
            'visibility',
            'pop',
            'sys.pod',
            'dt_txt'
        ];

        const firstItem = data.forecast.list[0];

        listItemFields.forEach(field => {
            const parts = field.split(/[\.\[\]]+/).filter(Boolean);
            let value = firstItem;

            for (const part of parts) {
                value = value?.[part];
            }

            const present = value !== undefined && value !== null;
            console.log(`  ${present ? 'Y' : 'N'} ${field}: ${present ? 'PRESENT' : 'MISSING'}`);
        });

        console.log(`\n Parity check complete for ${mode} mode\n`);

    } catch (error) {
        console.error('\n Error:', error.message);
    }
}

testParity();