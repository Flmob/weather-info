import { NextResponse } from "next/server";

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const BASE_URL =
  process.env.OPEN_WEATHER_URL || "https://api.openweathermap.org";

const LatLonErrorMessage = "'lat' or 'lon' parameter is missing";
const CityErrorMessage = "'locationName' parameter is missing";

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: API endpoints for fetching weather data and location information.
 * 
 * /api/weather:
 *   get:
 *     tags: [Weather]
 *     summary: Fetch weather data or location information based on query parameters.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [search, geo-direct, geo-reverse, weather]
 *         required: true
 *         description: Type of request to determine the API endpoint and response format.
 *       - in: query
 *         name: locationName
 *         schema:
 *           type: string
 *         description: Name of the location (required for 'search' and 'geo-direct' types).
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude coordinate (required for 'geo-reverse' and 'weather' types).
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         description: Longitude coordinate (required for 'geo-reverse' and 'weather' types).
 *     responses:
 *       200:
 *         description: Successful response with weather or location data.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error while fetching data from the OpenWeather API.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'search', 'geo-direct', 'geo-reverse', 'weather'
  const locationName = searchParams.get("locationName");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  let url = "";

  if (type === "search" || type === "geo-direct") {
    if (!locationName) {
      return NextResponse.json({ error: CityErrorMessage }, { status: 400 });
    }

    url = `${BASE_URL}/geo/1.0/direct?q=${locationName}&limit=${type === "search" ? 5 : 1}&appid=${API_KEY}`;
  }

  if (type === "geo-reverse") {
    if (!lat || !lon) {
      return NextResponse.json({ error: LatLonErrorMessage }, { status: 400 });
    }
    url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  }

  if (type === "weather") {
    if (!lat || !lon) {
      return NextResponse.json({ error: LatLonErrorMessage }, { status: 400 });
    }
    url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  }

  if (!url) {
    return NextResponse.json(
      { error: "Invalid type or parameters" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
