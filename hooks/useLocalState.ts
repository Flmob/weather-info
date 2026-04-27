"use client";
import { useSyncExternalStore, useCallback } from "react";

export function useLocalState<T>(key: string, initialValue: T) {
  const getSnapshot = () => {
    const item = window.localStorage.getItem(key);
    return item !== null ? item : JSON.stringify(initialValue);
  };

  const getServerSnapshot = () => JSON.stringify(initialValue);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setState = (newValue: T | ((prev: T) => T)) => {
    const currentRaw = getSnapshot();
    const currentValue = JSON.parse(currentRaw) as T;

    const valueToStore =
      newValue instanceof Function ? newValue(currentValue) : newValue;

    window.localStorage.setItem(key, JSON.stringify(valueToStore));
    window.dispatchEvent(new Event("storage"));
  };

  return [JSON.parse(store) as T, setState] as const;
}
