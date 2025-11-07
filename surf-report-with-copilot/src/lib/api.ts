/**
 * Open Meteo API Client
 * Provides methods to interact with Open Meteo's Geocoding and Marine Weather APIs
 */

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

export interface MarineWeather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    wave_height: string;
    sea_surface_temperature: string;
  };
  current: {
    time: string;
    interval: number;
    wave_height: number | null;
    sea_surface_temperature: number | null;
  };
}

interface GeocodingResponse {
  results?: Location[];
  generationtime_ms?: number;
}

const GEOCODING_API_BASE_URL = "https://geocoding-api.open-meteo.com/v1";
const MARINE_API_BASE_URL = "https://marine-api.open-meteo.com/v1";

/**
 * Search for locations by name using Open Meteo Geocoding API
 * @param query - The location name to search for
 * @param count - Maximum number of results to return (default: 10)
 * @param language - Language for the results (default: "en")
 * @returns Promise with array of matching locations
 * @throws Error if the API request fails
 */
export async function searchLocations(
  query: string,
  count: number = 10,
  language: string = "en"
): Promise<Location[]> {
  if (!query.trim()) {
    return [];
  }

  const url = new URL(`${GEOCODING_API_BASE_URL}/search`);
  url.searchParams.append("name", query);
  url.searchParams.append("count", count.toString());
  url.searchParams.append("language", language);
  url.searchParams.append("format", "json");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  const data: GeocodingResponse = await response.json();

  return data.results || [];
}

/**
 * Get current marine weather for a specific location using Open Meteo Marine Weather API
 * @param latitude - The latitude of the location
 * @param longitude - The longitude of the location
 * @returns Promise with marine weather data
 * @throws Error if the API request fails
 */
export async function getMarineWeather(
  latitude: number,
  longitude: number
): Promise<MarineWeather> {
  const url = new URL(`${MARINE_API_BASE_URL}/marine`);
  url.searchParams.append("latitude", latitude.toString());
  url.searchParams.append("longitude", longitude.toString());
  url.searchParams.append("current", "wave_height,sea_surface_temperature");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch marine weather: ${response.statusText}`);
  }

  const data: MarineWeather = await response.json();

  return data;
}
