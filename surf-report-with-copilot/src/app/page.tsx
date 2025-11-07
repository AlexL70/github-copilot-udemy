"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { searchLocations, type Location } from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

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
              className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex gap-4">
                  <span>Lat: {location.latitude.toFixed(4)}</span>
                  <span>Lon: {location.longitude.toFixed(4)}</span>
                </div>
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
