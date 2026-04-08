/* eslint-disable react-refresh/only-export-components -- context + hook in one module */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DAISY_THEME_OPTIONS,
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
} from "../constants/daisyThemes.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && DAISY_THEME_OPTIONS.some((t) => t.id === stored)) {
        return stored;
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_THEME_ID;
  });

  const setTheme = useCallback((next) => {
    console.log("setTheme called with:", next);
    if (!DAISY_THEME_OPTIONS.some((t) => t.id === next)) {
      console.error("Invalid theme ID prevented:", next);
      return;
    }
    setThemeState(next);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      console.error("Failed to save theme to localStorage");
    }
    
    document.documentElement.setAttribute("data-theme", theme);
    
    // Verify it was applied to the HTML tag
    console.log("HTML data-theme attribute is now:", document.documentElement.getAttribute("data-theme"));
    
    // Check if CSS variables for the theme are actually attached to the document root
    const rootStyles = getComputedStyle(document.documentElement);
    console.log("Computed --b1 (base-100) color variable:", rootStyles.getPropertyValue("--b1"));
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      themes: DAISY_THEME_OPTIONS,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
