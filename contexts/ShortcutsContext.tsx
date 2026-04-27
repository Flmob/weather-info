"use client";
import React, { createContext, useEffect, useRef } from "react";

import {
  Modifier,
  Shortcut,
  ShortcutHandler,
  ShortcutRegistry,
  ShortcutsContextType,
} from "@/types";

export const ShortcutsContext = createContext<ShortcutsContextType>({
  register: () => {},
  unregister: () => {},
});

const normalizeShortcut = (shortcut: Shortcut): string => {
  const mods = shortcut.modifiers?.slice().sort() || []; // Sort alphabetically
  const key = shortcut.key.toUpperCase(); // Normalize case
  return [...mods, key].join("+");
};

export const ShortcutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Registry for shortcut with key as shortcut combination and value as the handler
  const ShortcutRegistryRef = useRef<ShortcutRegistry>(new Map());

  const register = (
    shortcut: Shortcut,
    handler: ShortcutHandler,
    override = false,
  ) => {
    const ShortcutRegistry = ShortcutRegistryRef.current;
    // before proceeding with logic let normalized the key
    // first we sort the modifiers from shortcut alphabetically
    // then make key uppercase for consistency

    const normalizedKey = normalizeShortcut(shortcut);

    // here checking for conflicts
    if (ShortcutRegistry.has(normalizedKey) && !override) {
      console.warn(
        `Conflict: "${normalizedKey}" is already registered for shortcut. Use override=true to replace or handle conflict.`,
      );
      return;
    }

    ShortcutRegistry.set(normalizedKey, handler);
  };

  const unregister = (shortcut: Shortcut) => {
    const normalizedKey = normalizeShortcut(shortcut);

    ShortcutRegistryRef.current.delete(normalizedKey);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    // this check is important as without this we wont be able to write in these inputs
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    const modifiers: Modifier[] = [];

    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.altKey) modifiers.push("Alt");
    if (event.shiftKey) modifiers.push("Shift");
    if (event.metaKey) modifiers.push("Meta");

    const normalizedKey = normalizeShortcut({ key: event.key, modifiers });

    const handler = ShortcutRegistryRef.current.get(normalizedKey);

    if (handler) {
      event.preventDefault();
      handler(event);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ShortcutsContext.Provider value={{ register, unregister }}>
      {children}
    </ShortcutsContext.Provider>
  );
};

export const useShortcuts = () => {
  const shortcutsContext = React.useContext(ShortcutsContext);

  if (!shortcutsContext) {
    console.error("useShortcuts must be used within a ShortcutProvider");
  }

  return shortcutsContext;
};
