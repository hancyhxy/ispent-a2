/* Author: Xinyi */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/*
 * An animated mouse cursor that travels from `from` to `to` and performs a
 * click "pulse" (a quick shrink) when it arrives. This is what sells the
 * cause-and-effect of an interaction in a screenshot-driven demo: the viewer
 * sees the pointer reach a button, click, and *then* the modal appears.
 *
 * Coordinates are in 1920x1080 video space (top-left origin).
 */
export const Cursor: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Frame at which the cursor starts moving. */
  moveStart: number;
  /** How long the travel takes, in frames. */
  moveDuration: number;
  /** Frame at which the click pulse fires (usually moveStart + moveDuration). */
  clickAt: number;
}> = ({ from, to, moveStart, moveDuration, clickAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Travel with a spring so it eases in and settles, like a real hand.
  const travel = spring({
    fps,
    frame: frame - moveStart,
    durationInFrames: moveDuration,
    config: { damping: 18, mass: 0.6 },
  });
  const x = interpolate(travel, [0, 1], [from.x, to.x]);
  const y = interpolate(travel, [0, 1], [from.y, to.y]);

  // Click pulse: a brief dip to 0.8 scale and back over ~8 frames.
  const clickScale = interpolate(
    frame,
    [clickAt - 2, clickAt + 2, clickAt + 8],
    [1, 0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // A soft ring that expands on click to emphasise the tap.
  const ringProgress = interpolate(frame, [clickAt, clickAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.2, 1.6]);
  const ringOpacity = interpolate(ringProgress, [0, 1], [0.5, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${clickScale})`,
        transformOrigin: "top left",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Click ripple */}
      <div
        style={{
          position: "absolute",
          left: -6,
          top: -6,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid #4F46E5",
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      {/* Pointer (system-style arrow) */}
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 2 L5 19 L9.5 14.5 L12.5 21 L15 20 L12 13.5 L18 13.5 Z"
          fill="white"
          stroke="#111827"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
