"use client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useLocation } from "@/contexts";
import { weatherAPI, getGradientColors } from "@/utils";
import { WeatherCard } from "@/components";

export default function Home() {
  const { coords, locationName, locationCountry } = useLocation();

  const { data: weather } = useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon],
    queryFn: () => weatherAPI.getWeatherByCoords(coords!.lat!, coords!.lon!),
    placeholderData: (previousData) => previousData,
    enabled: !!coords?.lat && !!coords?.lon,
    staleTime: 5 * 60 * 1000, // Cache weather data for 5 minutes
  });

  const colors = useMemo(
    () => getGradientColors(weather?.weather[0]?.id || 0),
    [weather],
  );

  return (
    <div
      className="
        flex flex-col items-center justify-center
        absolute z-0 min-h-screen w-full animate-weather-flow bg-size-[400%_400%] transition-[background-image] duration-1000
      "
      style={{ backgroundImage: `linear-gradient(135deg, ${colors})` }}
    >
      {!weather && !coords && (
        <div
          className="
            transition w-full max-w-md min-h-[50%] max-h-[80%]
            flex flex-col items-center justify-center p-4
            backdrop-blur-md border rounded-2xl border-white/20 bg-white/10
          "
        >
          <p className="text-lg text-center">
            Please allow location access or enter a location to see the weather
            information.
          </p>
        </div>
      )}

      {weather && (
        <WeatherCard
          weather={weather}
          locationName={locationName}
          locationCountry={locationCountry}
        />
      )}
    </div>
  );
}
