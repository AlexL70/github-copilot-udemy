/**
 * Open Meteo API Client
 * Provides methods to interact with Open Meteo's Geocoding API
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

interface GeocodingResponse {
  results?: Location[];
  generationtime_ms?: number;
}

const GEOCODING_API_BASE_URL = "https://geocoding-api.open-meteo.com/v1";

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
