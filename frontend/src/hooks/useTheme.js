/* Author: Xinyi */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ispent_theme';

// Source of truth on first render is the data-theme the inline script in
// index.html already applied (so this never disagrees with what the user
// sees). Toggling writes both the DOM attribute — which re-themes the
// whole app via the CSS variable cascade — and localStorage so the
// choice survives reloads.
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

export default function useTheme() {
  const [theme, setThemeState] = useState(currentTheme);

  const setTheme = useCallback((next) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable (private mode) — theme still applies
         for this session, it just won't persist. Non-fatal. */
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, toggle };
}
