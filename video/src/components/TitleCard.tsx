/* Author: Xinyi */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/*
 * A full-bleed black title card with centred white text — the bookend treatment
 * for the demo (intro hook + slogan at the start, brand + author at the end).
 * It deliberately contrasts with the in-app sections: those float a screenshot
 * on a near-black stage (#0D0D0F) with captions below; these are pure #000 with
 * the text owning the whole frame, so the cuts read as chapter breaks.
 *
 * Text fades up with a tiny scale, holds, then fades out — never a hard cut.
 * `title` is the headline; optional `subtitle` sits below it a notch smaller.
 */
export const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  /** Total frames this card is on screen (its scene's duration). */
  durationInFrames: number;
  /** Headline size in px (brand names go bigger than slogans). */
  titleSize?: number;
  fadeFrames?: number;
}> = ({ title, subtitle, durationInFrames, titleSize = 64, fadeFrames = 16 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // A barely-there scale-up as it fades in, for a soft "settle".
  const scale = interpolate(frame, [0, fadeFrames], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const FONT =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            fontFamily: FONT,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.35,
              fontFamily: FONT,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
