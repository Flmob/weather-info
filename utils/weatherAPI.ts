import { Location, WeatherResponse } from "@/types";

export const weatherAPI = {
  searchLocationsByName: async (locationName: string): Promise<Location[]> => {
    const urlParams = new URLSearchParams({ type: "search", locationName });
    const res = await fetch(`/api/weather?${urlParams.toString()}`);
    const data = await res.json();
    if (data.cod) return []; // Request returns array on success, object with 'cod' on error
    return data;
  },

  getCoordsByLocationName: async (
    locationName: string,
  ): Promise<{ lat: number | null; lon: number | null }> => {
    const urlParams = new URLSearchParams({ type: "geo-direct", locationName });
    const res = await fetch(`/api/weather?${urlParams.toString()}`);
    const data = await res.json();
    if (!(data.cod === "200")) return { lat: null, lon: null };
    return { lat: data[0]?.lat, lon: data[0]?.lon };
  },

  getLocationByCoords: async (
    lat: number,
    lon: number,
  ): Promise<Location | null> => {
    const urlParams = new URLSearchParams({
      type: "geo-reverse",
      lat: lat.toString(),
      lon: lon.toString(),
    });
    const res = await fetch(`/api/weather?${urlParams.toString()}`);
    const data = await res.json();
    if (data.cod) return null; // Request returns array on success, object with 'cod' on error
    return data[0] || null;
  },

  getWeatherByCoords: async (
    lat: number,
    lon: number,
  ): Promise<WeatherResponse> => {
    const urlParams = new URLSearchParams({
      type: "weather",
      lat: lat.toString(),
      lon: lon.toString(),
    });
    const res = await fetch(`/api/weather?${urlParams.toString()}`);
    const data = await res.json();
    if (!(data.cod === 200)) return {} as WeatherResponse;
    return data;
  },
};
