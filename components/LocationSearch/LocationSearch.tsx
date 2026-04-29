"use client";
import { useState, useMemo, useEffect, useCallback, useRef, use } from "react";
import { Search, LoaderCircle } from "lucide-react";
import { debounce, isEqual } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { weatherAPI } from "@/utils";
import { Location } from "@/types";
import { useLocation, useShortcuts } from "@/contexts";
import { useLocalState } from "@/hooks";

import { LocationOption } from "./components";

export const LocationSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const latestDeletedRef = useRef<Location | null>(null);

  const [locationsHistory, setLocationsHistory] = useLocalState<Location[]>(
    "locations-history",
    [],
  );

  const {
    setLocation,
    locationName,
    coords,
    isLoading: isLocationLoading,
  } = useLocation();
  const { register, unregister } = useShortcuts();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setActiveIndex(-1);
      }, 500),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedSetSearch(value);
  };

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["searchLocations", searchQuery],
    queryFn: () => weatherAPI.searchLocationsByName(searchQuery),
    enabled: !!searchQuery, // Only run the query if there is a search query
    staleTime: Infinity, // Cache results indefinitely since location data doesn't change often
  });

  const onLocationSelect = (location: Location) => {
    setLocation(location);
    debouncedSetSearch.cancel(); // Cancel any pending search to prevent overwriting the selected location
    setLocationsHistory((prev) => {
      prev = prev.filter((l) => !isEqual(l, location));
      return [location, ...prev.slice(0, 4)];
    });
    setIsFocused(false);
    setSearchQuery("");
    setInputValue("");
    setActiveIndex(-1);
  };

  const locationsToUse = useMemo(
    () => (searchQuery ? locations : locationsHistory),
    [searchQuery, locations, locationsHistory],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!locationsToUse || locationsToUse.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < locationsToUse.length - 1 ? prev + 1 : prev,
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < locationsToUse.length) {
        onLocationSelect(locationsToUse[activeIndex]);
        setIsFocused(false);
      }
    }
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const undoLastDeletedLocation = useCallback(() => {
    if (!latestDeletedRef.current) return;

    setLocationsHistory((prev) => {
      prev = prev.filter((l) => !isEqual(l, latestDeletedRef.current));
      return [latestDeletedRef.current!, ...prev.slice(0, 4)];
    });

    latestDeletedRef.current = null;
  }, [latestDeletedRef, setLocationsHistory]);

  useEffect(() => {
    register({ key: "z", modifiers: ["Meta"] }, undoLastDeletedLocation);
    register({ key: "z", modifiers: ["Ctrl"] }, undoLastDeletedLocation);

    return () => {
      unregister({ key: "z", modifiers: ["Meta"] });
      unregister({ key: "z", modifiers: ["Ctrl"] });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center relative">
      <input
        type="text"
        name="location"
        onChange={handleInputChange}
        value={inputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="Search location"
        className="
            absolute right-0 
            transition-[width,opacity,color] duration-200 ease-in-out
            w-10.5 hover:w-64 focus:w-64
            border rounded-full 
            border-white/20 bg-white/10 backdrop-blur-md
            py-2 px-4 outline-none
            placeholder:opacity-0 text-transparent
            hover:placeholder:opacity-100 focus:placeholder:opacity-100
            hover:text-black focus:text-black
            hover:pr-10 focus:pr-9
            cursor-pointer focus:cursor-text
        "
      />
      <div className="absolute right-1 flex items-center justify-center rounded-full p-1 pointer-events-none">
        {isLoading || isLocationLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Search />
        )}
      </div>
      <div
        className={`
            transition-[height,opacity,padding] duration-200 ease-in-out
          bg-white/10 backdrop-blur-lg
            absolute top-7 right-0 
            rounded-2xl p-2
            w-64
            ${isFocused ? "h-auto opacity-100 border-white/20" : "h-0 opacity-0 overflow-hidden p-0 border-none shadow-none"}
        `}
      >
        {locationsToUse.length === 0 && (
          <div className="p-2 rounded-xl bg-white/10 border-white/20">
            No locations found
          </div>
        )}

        {locationsToUse.map((location, index) => (
          <LocationOption
            isHistory={!searchQuery}
            key={`${!!searchQuery ? "search" : "history"}-${location.country.toLowerCase()}-${location.name}-${index}`}
            location={location}
            isActive={index === activeIndex}
            isSelected={
              locationName === location.name &&
              coords?.lat === location.lat &&
              coords?.lon === location.lon
            }
            onClick={() => onLocationSelect(location)}
            onDelete={
              searchQuery
                ? undefined
                : () => {
                    setLocationsHistory(
                      locationsHistory.filter((l) => !isEqual(l, location)),
                    );
                    latestDeletedRef.current = location;
                  }
            }
          />
        ))}
      </div>
    </div>
  );
};
