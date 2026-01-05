# Weather API Contract

## GET /api/weather?city={cityName}

### Request

- **Method** GET
- **Query Parameters:**
- 'city (required) - City Name (e.g "London", "Tokyo")

### Success Response (200)

```json
{
  "current": {
    "coord": { "lon": number, "lat": number },
    "weather": [
      {
        "id": number,
        "main": string,
        "description": string,
        "icon": string
      }
    ],
    "main": {
      "temp": number,
      "feels_like": number,
      "temp_min": number,
      "temp_max": number,
      "pressure": number,
      "humidity": number
    },
    "wind": { "speed": number, "deg": number },
    "name": string,
    "sys": { "country": string }
  },
  "forecast": {
    "city": {
      "name": string,
      "coord": { "lat": number, "lon": number },
      "country": string
    },
    "list": [
      {
        "dt": number,
        "main": { "temp": number, "humidity": number },
        "weather": [{ "main": string, "description": string }],
        "dt_txt": string
      }
    ]
  }
}
```

### Error Responses

**400 - Missing City**

```json
{
  "error": "City parameter is required"
}
```

**401- Invalid Configuration**

```json
{
  "error": "Server Configuration error",
  "message": "OpenWeather_API_Key not configured"
}
```

**404 - City Not Found**

```json
{
  "error": "City not found",
  "city": "...",
  "message": "..."
}
```

**500 - Server Error**

```json
{
  "error": "Internal server error",
  "message": "..."
}
```
