/* Author: Xinyi */
/*
 * Design tokens mirrored from the iSpent app (frontend/src/index.css).
 * Keeping them here lets any UI we re-create in Remotion (cursor, captions,
 * highlight rings) match the real product pixel-for-pixel.
 */
export const theme = {
  // Brand / accent
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  growth: "#16A34A", // income / positive
  decline: "#DC2626", // expense / negative

  // Surfaces (light theme)
  bg: "#F4F5F7",
  card: "#FFFFFF",
  border: "#E5E7EB",

  // Text
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Captions overlay (dark band) for readability over screenshots
  captionBg: "rgba(17, 19, 23, 0.82)",
  captionText: "#FFFFFF",

  // Radii — the app's "round everything" scale
  radiusSm: 16,
  radiusCard: 24,
  radiusLg: 32,
} as const;

// Canonical video dimensions and frame rate, referenced by Root + scenes.
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;
