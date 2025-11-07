"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  searchLocations,
  getMarineWeather,
  type Location,
  type MarineWeather,
} from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [marineWeather, setMarineWeather] = useState<
    Record<number, MarineWeather | null>
  >({});
  const [loadingWeather, setLoadingWeather] = useState<Record<number, boolean>>(
    {}
  );
  const [noMarineData, setNoMarineData] = useState<Record<number, boolean>>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setLocations([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await searchLocations(query);

      if (results.length > 0) {
        setLocations(results);
      } else {
        setLocations([]);
        setError("No locations found");
      }
    } catch {
      setError("Error searching for locations. Please try again.");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMarineWeather = async (location: Location) => {
    setLoadingWeather((prev) => ({ ...prev, [location.id]: true }));

    try {
      const weather = await getMarineWeather(
        location.latitude,
        location.longitude
      );

      // Check if both wave_height and sea_surface_temperature are null
      if (
        weather.current.wave_height === null &&
        weather.current.sea_surface_temperature === null
      ) {
        setNoMarineData((prev) => ({ ...prev, [location.id]: true }));
        setMarineWeather((prev) => ({ ...prev, [location.id]: null }));
      } else {
        setMarineWeather((prev) => ({ ...prev, [location.id]: weather }));
        setNoMarineData((prev) => ({ ...prev, [location.id]: false }));
      }
    } catch (error) {
      console.error("Failed to fetch marine weather:", error);
      // You could set an error state here if needed
    } finally {
      setLoadingWeather((prev) => ({ ...prev, [location.id]: false }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If input is empty, clear results immediately
    if (!value.trim()) {
      setLocations([]);
      setError("");
      setLoading(false);
      setIsWaiting(false);
      return;
    }

    // Set waiting state
    setIsWaiting(true);
    setLoading(false);
    setError("");

    // Set new timer to call API after 2 seconds
    debounceTimerRef.current = setTimeout(() => {
      setIsWaiting(false);
      handleSearch(value);
    }, 2000);
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-zinc-900 p-8">
      <main className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Location Search
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Search for locations using Open Meteo API
          </p>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full text-lg"
          />
        </div>

        {isWaiting && (
          <p className="text-center text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
            Searching in 2 seconds...
          </p>
        )}

        {loading && (
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Searching...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="space-y-3">
          {locations.map((location) => (
            <Card
              key={location.id}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  {location.name}
                  {location.admin1 && `, ${location.admin1}`}
                </CardTitle>
                <CardDescription>
                  {location.country} • {location.timezone}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex gap-4">
                    <span>Lat: {location.latitude.toFixed(4)}</span>
                    <span>Lon: {location.longitude.toFixed(4)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleCheckMarineWeather(location)}
                  disabled={
                    loadingWeather[location.id] || noMarineData[location.id]
                  }
                  className="w-full"
                >
                  {loadingWeather[location.id]
                    ? "Loading..."
                    : "Check marine weather"}
                </Button>

                {noMarineData[location.id] && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      ℹ️ No marine weather information available. This location
                      is probably not on the shore.
                    </p>
                  </div>
                )}

                {marineWeather[location.id] && !noMarineData[location.id] && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Marine Weather
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Wave Height:
                        </span>
                        <p className="text-blue-900 dark:text-blue-100">
                          {marineWeather[location.id]!.current.wave_height}{" "}
                          {
                            marineWeather[location.id]!.current_units
                              .wave_height
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Sea Surface Temp:
                        </span>
                        <p className="text-blue-900 dark:text-blue-100">
                          {
                            marineWeather[location.id]!.current
                              .sea_surface_temperature
                          }
                          {
                            marineWeather[location.id]!.current_units
                              .sea_surface_temperature
                          }
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Time:
                        </span>
                        <p className="text-blue-900 dark:text-blue-100">
                          {marineWeather[location.id]!.current.time}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {searchQuery && locations.length === 0 && !loading && !error && (
          <p className="text-center text-zinc-600 dark:text-zinc-400 mt-8">
            Start typing to search for locations
          </p>
        )}
      </main>
    </div>
  );
}
