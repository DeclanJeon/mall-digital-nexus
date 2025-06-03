import { fetchWeatherApi } from 'openmeteo';

// Weather code mapping to our app's weather types
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';

// Weather data interface for what we'll use in our application
export interface WeatherData {
  temperature: number;
  weatherType: WeatherType;
  windSpeed: number;
  humidity: number;
  cloudCover: number;
  isDay: boolean;
  precipitation: number;
  snowfall: number;
}

// Map WMO weather codes to our simplified weather types
// https://open-meteo.com/en/docs#weathervariables
export const mapWeatherCodeToType = (code: number): WeatherType => {
  // Clear sky
  if (code === 0) return 'sunny';

  // Mainly clear, partly cloudy, and overcast
  if (code >= 1 && code <= 3) return 'cloudy';

  // Fog and depositing rime fog
  if (code >= 45 && code <= 48) return 'foggy';

  // Drizzle, rain, and freezing rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';

  // Snow fall, snow grains, and snow showers
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snowy';

  // Thunderstorms
  if (code >= 95 && code <= 99) return 'rainy';

  return 'sunny'; // Default if code doesn't match
};

export const fetchWeatherForLocation = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    const params = {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'is_day',
        'precipitation',
        'rain',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'wind_speed_10m',
      ],
    };

    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location
    const response = responses[0];
    const current = response.current()!;

    // Map the data to our application's format
    const weatherData: WeatherData = {
      temperature: current.variables(0)!.value(),
      humidity: current.variables(1)!.value(),
      isDay: Boolean(current.variables(2)!.value()),
      precipitation: current.variables(3)!.value(),
      weatherType: mapWeatherCodeToType(current.variables(6)!.value()),
      cloudCover: current.variables(7)!.value(),
      windSpeed: current.variables(8)!.value(),
      snowfall: current.variables(5)!.value(),
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return default weather data in case of error
    return {
      temperature: 20,
      weatherType: 'sunny',
      windSpeed: 5,
      humidity: 40,
      cloudCover: 10,
      isDay: true,
      precipitation: 0,
      snowfall: 0,
    };
  }
};

// Get weather for multiple community zones
export const fetchGlobalWeather = async (
  zones: Array<{ id: string; position: { x: number; y: number } }>
): Promise<Record<string, WeatherData>> => {
  // Create a map to store weather data for each zone
  const weatherMap: Record<string, WeatherData> = {};

  // Convert percentage positions to lat/long coordinates
  // and fetch weather data for each zone
  try {
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < zones.length; i += batchSize) {
      const batch = zones.slice(i, i + batchSize);

      const promises = batch.map((zone) => {
        // Transform percentage position to lat/lng (rough world map coordinates)
        const lat = 90 - (zone.position.y / 100) * 180;
        const lng = (zone.position.x / 100) * 360 - 180;

        return fetchWeatherForLocation(lat, lng).then((data) => {
          weatherMap[zone.id] = data;
        });
      });

      await Promise.all(promises);

      // Small delay between batches to be nice to the API
      if (i + batchSize < zones.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return weatherMap;
  } catch (error) {
    console.error('Error fetching global weather data:', error);
    return weatherMap;
  }
};
