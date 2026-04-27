"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { weatherAPI } from "@/utils";
import { useLocalState } from "@/hooks";
import { Location } from "@/types";

type Coords = {
  lat: number | null;
  lon: number | null;
};

type LocationName = string | null;
type LocationCountry = string | null;

type LocationProviderProps = {
  children: ReactNode;
  initialLocation: string | null;
};

type LocationContextType = {
  coords: Coords | null;
  locationName: LocationName;
  locationCountry: LocationCountry;
  setLocation: (location: Location) => void;
  isLoading: boolean;
};

const defaultCoords: Coords = {
  lat: null,
  lon: null,
};

const LocationContext = createContext<LocationContextType>({
  coords: null,
  locationName: null,
  locationCountry: null,
  setLocation: () => {},
  isLoading: false,
});

export function LocationProvider({
  children,
  initialLocation,
}: LocationProviderProps) {
  const [localCoords, setLocalCoords] = useLocalState<Coords>(
    "location-coords",
    { ...defaultCoords },
  );
  const [localLocationName, setLocalLocationName] = useLocalState<LocationName>(
    "location-name",
    initialLocation,
  );
  const [localLocationCountry, setLocalLocationCountry] =
    useLocalState<LocationCountry>("location-country", null);

  const { data: locationByCoords, isFetching: isLocationByCoordsFetching } =
    useQuery({
      queryKey: ["locationName", localCoords.lat, localCoords.lon],
      queryFn: () =>
        weatherAPI.getLocationByCoords(localCoords.lat!, localCoords.lon!),
      enabled: !!localCoords.lat && !!localCoords.lon && !localLocationName, // Fetch location name only if lat/lon are available and name is not set
      staleTime: Infinity,
    });

  const { data: coords, isFetching: isCoordsFetching } = useQuery({
    queryKey: ["coords", localLocationName],
    queryFn: () => weatherAPI.getCoordsByLocationName(localLocationName!),
    enabled: !!localLocationName && (!localCoords.lat || !localCoords.lon), // Fetch coords only if name is available and lat/lon are not set
    staleTime: Infinity,
  });

  useEffect(() => {
    if (locationByCoords && (!localLocationName || !localLocationCountry)) {
      setLocalLocationName(locationByCoords.name);
      setLocalLocationCountry(locationByCoords.country);
    }
  }, [
    locationByCoords,
    localLocationName,
    localLocationCountry,
    setLocalLocationCountry,
    setLocalLocationName,
  ]);

  const finalCoords: Coords | null = useMemo(() => {
    if (localCoords.lat !== null && localCoords.lon !== null) {
      return { lat: localCoords.lat, lon: localCoords.lon };
    }

    if (coords?.lat !== undefined && coords?.lon !== undefined) {
      return { lat: coords.lat, lon: coords.lon };
    }

    return null;
  }, [localCoords.lat, localCoords.lon, coords]);

  useEffect(() => {
    if (
      localLocationName ||
      locationByCoords ||
      (localCoords.lat && localCoords.lon)
    )
      return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalCoords({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Geolocation permission denied or error:", error);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider
      value={{
        locationName: localLocationName,
        locationCountry: localLocationCountry,
        coords: finalCoords,
        isLoading: isLocationByCoordsFetching || isCoordsFetching,
        setLocation: (location: Location) => {
          setLocalLocationName(location.name);
          setLocalLocationCountry(location.country);
          setLocalCoords({ lat: location.lat, lon: location.lon });
        },
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const locationContext = useContext(LocationContext);

  if (!locationContext) {
    console.error("useLocation must be used within a LocationProvider");
  }

  return useContext(LocationContext);
};
