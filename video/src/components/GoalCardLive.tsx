/* Author: Xinyi */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/*
 * A re-creation of the Eating Out spending-limit card, built from the app's
 * design tokens so it matches the real UI. Unlike a screenshot, this card can
 * ANIMATE: when the food expense from the previous scene lands, the spent
 * amount counts up and the progress bar grows — making the "one entry moves a
 * goal" cause-and-effect visible and believable.
 *
 * Real seed values: Eating Out = $158.50 / $400 (40%). The scene adds a $12.80
 * food expense, so it animates to $171.30 / $400 (~43%).
 */
export const GoalCardLive: React.FC<{
  /** Frame at which the count-up begins. */
  bumpAt: number;
  fromSpent?: number;
  toSpent?: number;
  cap?: number;
}> = ({ bumpAt, fromSpent = 158.5, toSpent = 171.3, cap = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven progress of the bump, 0 -> 1.
  const t = spring({
    fps,
    frame: frame - bumpAt,
    durationInFrames: 30,
    config: { damping: 18 },
  });

  const spent = interpolate(t, [0, 1], [fromSpent, toSpent]);
  const pct = (spent / cap) * 100;
  const barWidth = `${Math.min(pct, 100)}%`;

  // A brief glow on the card when the bump fires, to draw the eye.
  const glow = interpolate(
    frame,
    [bumpAt, bumpAt + 8, bumpAt + 40],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        width: 620,
        background: theme.card,
        borderRadius: theme.radiusCard,
        padding: 32,
        boxShadow: `0 12px 40px rgba(79,70,229,${0.06 + glow * 0.22})`,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        outline: `${glow * 3}px solid rgba(79,70,229,${glow * 0.5})`,
      }}
    >
      {/* Header: emoji + title + category */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 44 }}>🍱</div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 700, color: theme.textPrimary }}>
            Eating Out
          </div>
          <div style={{ fontSize: 20, color: theme.textMuted }}>Food</div>
        </div>
      </div>

      {/* Amount line */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 38, fontWeight: 800, color: theme.textPrimary }}>
          ${spent.toFixed(2)}
        </span>
        <span style={{ fontSize: 24, color: theme.textMuted }}>/ ${cap.toFixed(2)}</span>
        <span style={{ fontSize: 24, color: theme.textMuted, marginLeft: "auto" }}>
          {Math.round(pct)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 14,
          borderRadius: 999,
          background: theme.border,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: barWidth,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight})`,
          }}
        />
      </div>

      <div style={{ fontSize: 19, color: theme.textMuted, marginTop: 18 }}>
        Tracks <b style={{ color: theme.textSecondary }}>food</b> expenses automatically.
      </div>
    </div>
  );
};
