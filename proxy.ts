import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

const maxAge = 60 * 60 * 24 * 7; // 1 week in seconds

export function proxy(request: NextRequest) {
  const { city = "" } = geolocation(request);

  const response = NextResponse.next();

  if (!request.cookies.has("user-city")) {
    response.cookies.set("user-city", encodeURIComponent(city), { maxAge });
  }

  if (!request.cookies.has('user-city')) {
    response.cookies.set('user-city', encodeURIComponent(city), { maxAge: 604800 });
  }

  return response;
}
