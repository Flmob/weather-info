"use client";
import Image from "next/image";
import { MoveUp } from "lucide-react";

import { WeatherResponse } from "@/types";

type WeatherCardProps = {
  weather: WeatherResponse;
  locationName: string | null;
  locationCountry: string | null;
};

export const WeatherCard = ({
  weather,
  locationName,
  locationCountry,
}: WeatherCardProps) => {
  const rotation = weather?.wind.deg ? weather.wind.deg + 180 : 180;

  return (
    <div
      className="
        transition w-full max-w-md min-h-[50%] max-h-[80%]
        flex flex-col gap-3 items-center justify-center p-4
        backdrop-blur-md border rounded-2xl border-white/20 bg-white/10
      "
    >
      <h1 className="text-2xl font-bold">
        {locationName}
        {locationCountry && (
          <span
            className={`ml-2 w-8 max-w-8 min-w-8 fi fi-${locationCountry?.toLowerCase()}`}
          ></span>
        )}
      </h1>
      <Image
        src={`https://openweathermap.org/payload/api/media/file/${weather?.weather[0]?.icon || "02d"}.png`}
        alt={weather?.weather[0]?.description || "Weather icon"}
        data-loaded="false"
        onLoad={(event) => {
          event.currentTarget.setAttribute("data-loaded", "true");
        }}
        className="
          data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10
          min-h-37.5 backdrop-blur-md border rounded-2xl border-white/20 bg-white/10
          select-none
        "
        width={150}
        height={150}
        loading="eager"
        unoptimized
      />
      <span>
        {weather?.weather[0]?.main} ({weather?.weather[0]?.description})
      </span>

      <span>
        {weather?.main.temp}°C, max: {weather?.main.temp_max}°C, min:{" "}
        {weather?.main.temp_min}°C
      </span>
  
      <span>Feels like: {weather?.main.feels_like}°C</span>

      <span>Humidity: {weather?.main.humidity}%</span>

      <div className="flex items-center space-x-2">
        <span>Wind speed: {weather?.wind.speed} m/s</span>
        <div
          className="
            w-6 h-6 transition-transform duration-500 ease-in-out
            border rounded-full border-white/20 bg-white/10
            flex items-center justify-center p-1
          "
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <MoveUp size={16} className="text-blue-400" />
        </div>
      </div>
    </div>
  );
};
