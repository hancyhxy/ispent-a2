/* Author: Xinyi */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { VIDEO } from "../theme";

/*
 * The app screenshot presented as a floating window on a dark canvas — rounded
 * corners + soft shadow, sized to ~88% of the frame. This reads as a polished
 * product showcase (not a full-bleed screen recording), gives white captions a
 * dark backdrop to sit on, and leaves a margin of dark space around the app.
 *
 * Shots are captured at a 1920x916 viewport; we keep that native ratio inside
 * the window so nothing is stretched. The window's geometry is fixed and
 * exported so cursors / overlays can map viewport coords into canvas space.
 */

// Source shots are now captured at a 1512x916 viewport (≈1.65:1, a normal
// desktop-web ratio — not the earlier ultra-wide 1920x916). The window keeps
// that ratio so the app never looks stretched.
const SHOT_VW = 1512;
const SHOT_VH = 916;

// Window geometry within the 1920x1080 canvas: height-led so the app sits
// comfortably with caption room below, width derived from the shot ratio.
export const WIN_H = 860;
export const WIN_W = Math.round((WIN_H * SHOT_VW) / SHOT_VH); // ≈1420
export const WIN_X = Math.round((VIDEO.width - WIN_W) / 2);
export const WIN_Y = 70;
export const WIN_RADIUS = 28;

/**
 * Map a point measured in the live viewport (1512x916) to canvas coords,
 * accounting for the window's position and the scale-down into the window.
 */
export const toCanvas = (x: number, y: number) => {
  const sx = WIN_W / SHOT_VW;
  const sy = WIN_H / SHOT_VH;
  return { x: WIN_X + x * sx, y: WIN_Y + y * sy };
};

/** Scale factor from viewport pixels to window pixels (for sizing overlays). */
export const WIN_SCALE = WIN_W / SHOT_VW;

export const Screenshot: React.FC<{
  src: string;
}> = ({ src }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: WIN_X,
        top: WIN_Y,
        width: WIN_W,
        height: WIN_H,
        borderRadius: WIN_RADIUS,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }}
      />
    </div>
  );
};

/** The dark stage the window floats on. Use as the scene background. */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: "#0D0D0F" }}>{children}</AbsoluteFill>
);
