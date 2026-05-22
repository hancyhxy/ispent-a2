/* Author: Xinyi */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

/*
 * The script voiceover line as clean white text in the dark margin below the
 * app window. No background band — the dark stage already provides contrast —
 * just a soft shadow for legibility. Fades in/out so it never hard-cuts.
 */
export const Caption: React.FC<{
  text: string;
  /** Total frames this caption is on screen (its scene's duration). */
  durationInFrames: number;
  fadeFrames?: number;
}> = ({ text, durationInFrames, fadeFrames = 12 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // A gentle rise as it fades in.
  const translateY = interpolate(frame, [0, fadeFrames], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 56,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 90,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 60px",
          color: "#FFFFFF",
          fontSize: 36,
          lineHeight: 1.3,
          fontWeight: 600,
          textAlign: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
