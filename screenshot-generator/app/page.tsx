"use client";

import { useEffect, useState, useCallback } from "react";
import { toPng } from "html-to-image";

// ── Constants ──────────────────────────────────────────────
const CANVAS_W = 1320;
const CANVAS_H = 2868;

const SCREEN_LEFT = 0.051;
const SCREEN_TOP = 0.022;
const SCREEN_W = 0.898;
const SCREEN_H = 0.956;
const SCREEN_RADIUS = 126;

// Unified warm gradient background (same for all light slides)
const BG_WARM = "linear-gradient(180deg, #F5F0EB 0%, #E8DFD5 100%)";
const BG_DARK = "#1A1A1A";
const TEXT_DARK = "#1A1A1A";
const TEXT_MUTED = "#8C8377";
const BRAND_BLUE = "#4B6EF5";

const FONT_SERIF = "var(--font-dm-serif), 'DM Serif Display', Georgia, serif";
const FONT_SANS = "var(--font-inter), Inter, system-ui, sans-serif";

const IMAGE_PATHS = [
  "/mockup.png",
  "/logo.svg",
  "/screenshots/bills_mobile.png",
  "/screenshots/addrecord_mobile.png",
  "/screenshots/addtag_mobile.png",
  "/screenshots/analysis_mobile.png",
  "/screenshots/goals_mobile.png",
  "/screenshots/analysis2.png",
];

// ── Image preload cache (data URIs) ───────────────────────
const imageCache: Record<string, string> = {};

async function preloadImage(path: string): Promise<void> {
  if (imageCache[path]) return;
  const res = await fetch(path);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      imageCache[path] = reader.result as string;
      resolve();
    };
    reader.readAsDataURL(blob);
  });
}

function img(path: string): string {
  return imageCache[path] || path;
}

// ── Phone Component ───────────────────────────────────────
function Phone({
  screenshot,
  width,
  style,
}: {
  screenshot: string;
  width: number;
  style?: React.CSSProperties;
}) {
  const height = (width / 1022) * 2082;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={img("/mockup.png")}
        alt=""
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />
      <img
        src={img(screenshot)}
        alt=""
        style={{
          position: "absolute",
          left: `${SCREEN_LEFT * 100}%`,
          top: `${SCREEN_TOP * 100}%`,
          width: `${SCREEN_W * 100}%`,
          height: `${SCREEN_H * 100}%`,
          borderRadius: (SCREEN_RADIUS * width) / 1022,
          objectFit: "cover",
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ── Category Label ────────────────────────────────────────
function Label({ children, color = TEXT_MUTED }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize: CANVAS_W * 0.026,
        fontWeight: 600,
        color,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: CANVAS_W * 0.015,
      }}
    >
      {children}
    </div>
  );
}

// ── Slide definitions ─────────────────────────────────────
interface SlideProps {
  id: string;
}

// Slide 1: Hero — Logo + headline, phone large & centered, bottom clipped
function Slide1({ id }: SlideProps) {
  const phoneW = CANVAS_W * 0.82;
  // Phone Y start — show a bit more of the screen
  const phoneTop = CANVAS_H * 0.34;
  return (
    <div
      id={id}
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: BG_WARM,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top content area */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: `${CANVAS_W * 0.14}px ${CANVAS_W * 0.08}px 0`,
          zIndex: 2,
        }}
      >
        {/* Logo + App name */}
        <div style={{ display: "flex", alignItems: "center", gap: CANVAS_W * 0.02, marginBottom: CANVAS_W * 0.035 }}>
          <img
            src={img("/logo.svg")}
            alt=""
            style={{ width: CANVAS_W * 0.16, height: CANVAS_W * 0.16, borderRadius: CANVAS_W * 0.035 }}
          />
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: CANVAS_W * 0.038,
              fontWeight: 600,
              color: TEXT_MUTED,
              letterSpacing: "0.01em",
            }}
          >
            iSpent
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: CANVAS_W * 0.09,
            fontWeight: 400,
            color: TEXT_DARK,
            lineHeight: 1.08,
          }}
        >
          Spend with
          <br />
          <span style={{ color: BRAND_BLUE, fontStyle: "italic" }}>clarity.</span>
        </div>
      </div>
      {/* Phone — large, centered horizontally, clipped at bottom */}
      <Phone
        screenshot="/screenshots/bills_mobile.png"
        width={phoneW}
        style={{
          position: "absolute",
          top: phoneTop,
          left: (CANVAS_W - phoneW) / 2,
          zIndex: 1,
        }}
      />
    </div>
  );
}

// Slide 2: Quick Entry — text left, phone right, no subtitle
function Slide2({ id }: SlideProps) {
  const phoneW = CANVAS_W * 0.52;
  return (
    <div
      id={id}
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: BG_WARM,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        padding: `0 ${CANVAS_W * 0.07}px`,
      }}
    >
      <div style={{ flex: 1, paddingRight: CANVAS_W * 0.03 }}>
        <Label>Quick Entry</Label>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: CANVAS_W * 0.082,
            fontWeight: 400,
            color: TEXT_DARK,
            lineHeight: 1.08,
          }}
        >
          Tap, tag,
          <br />
          <span style={{ color: BRAND_BLUE, fontStyle: "italic" }}>done.</span>
        </div>
      </div>
      <Phone screenshot="/screenshots/addrecord_mobile.png" width={phoneW} />
    </div>
  );
}

// Slide 3: Analysis — front phone with mockup, back raw screenshot (no frame, slight rotation)
function Slide3({ id }: SlideProps) {
  const phoneW = CANVAS_W * 0.78;
  const rawW = CANVAS_W * 0.58;
  // Same Y start as Slide 1 for consistency
  const phoneTop = CANVAS_H * 0.34;
  return (
    <div
      id={id}
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: BG_WARM,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Text top-left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: `${CANVAS_W * 0.1}px ${CANVAS_W * 0.08}px 0`,
          zIndex: 3,
        }}
      >
        <Label>Spending Analysis</Label>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: CANVAS_W * 0.09,
            fontWeight: 400,
            color: TEXT_DARK,
            lineHeight: 1.08,
          }}
        >
          Know where
          <br />
          your money
          <br />
          <span style={{ color: BRAND_BLUE, fontStyle: "italic" }}>goes.</span>
        </div>
      </div>
      {/* Back: raw screenshot, no mockup, slight left rotation, bottom clipped */}
      <img
        src={img("/screenshots/analysis2.png")}
        alt=""
        style={{
          position: "absolute",
          top: phoneTop + CANVAS_H * 0.15,
          left: CANVAS_W * -0.05,
          width: rawW,
          height: "auto",
          borderRadius: CANVAS_W * 0.035,
          objectFit: "cover",
          opacity: 0.3,
          transform: "rotate(-5deg)",
          transformOrigin: "top center",
          zIndex: 0,
        }}
      />
      {/* Front: phone with mockup, right of center, same Y as Slide 1 */}
      <Phone
        screenshot="/screenshots/analysis_mobile.png"
        width={phoneW}
        style={{
          position: "absolute",
          top: phoneTop,
          left: CANVAS_W * 0.28,
          zIndex: 1,
        }}
      />
    </div>
  );
}

// Slide 4: Budget Goals — text top-left (like Slide3), phone centered large clipped (like Slide1)
function Slide4({ id }: SlideProps) {
  const phoneW = CANVAS_W * 0.82;
  const phoneTop = CANVAS_H * 0.34;
  return (
    <div
      id={id}
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: BG_WARM,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Text top-left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: `${CANVAS_W * 0.1}px ${CANVAS_W * 0.08}px 0`,
          zIndex: 2,
        }}
      >
        <Label>Budget Goals</Label>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: CANVAS_W * 0.09,
            fontWeight: 400,
            color: TEXT_DARK,
            lineHeight: 1.08,
          }}
        >
          Stay on budget,
          <br />
          <span style={{ color: BRAND_BLUE, fontStyle: "italic" }}>effortlessly.</span>
        </div>
      </div>
      {/* Phone centered, bottom clipped */}
      <Phone
        screenshot="/screenshots/goals_mobile.png"
        width={phoneW}
        style={{
          position: "absolute",
          top: phoneTop,
          left: (CANVAS_W - phoneW) / 2,
          zIndex: 1,
        }}
      />
    </div>
  );
}

// Slide 5: Custom Tags — dark background, two phones stacked (front/back)
function Slide5({ id }: SlideProps) {
  const phoneBgW = CANVAS_W * 0.65;
  const phoneFgW = CANVAS_W * 0.65;
  return (
    <div
      id={id}
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: BG_WARM,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Text top-left */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          padding: `${CANVAS_W * 0.12}px ${CANVAS_W * 0.08}px 0`,
        }}
      >
        <Label>Quick Entry</Label>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: CANVAS_W * 0.09,
            fontWeight: 400,
            color: TEXT_DARK,
            lineHeight: 1.08,
          }}
        >
          Tap, tag,
          <br />
          <span style={{ color: BRAND_BLUE, fontStyle: "italic" }}>done.</span>
        </div>
      </div>
      {/* Two phones: back (top-left) and front (bottom-right), overlapping */}
      <div
        style={{
          position: "relative",
          flex: 1,
          marginTop: CANVAS_W * -0.02,
        }}
      >
        {/* Back phone — top-left, manage tags (behind) */}
        <Phone
          screenshot="/screenshots/addtag_mobile.png"
          width={phoneBgW}
          style={{
            position: "absolute",
            top: CANVAS_W * 0.12,
            left: 0,
            zIndex: 0,
            opacity: 0.85,
          }}
        />
        {/* Front phone — bottom-right, add record (in front) */}
        <Phone
          screenshot="/screenshots/addrecord_mobile.png"
          width={phoneFgW}
          style={{
            position: "absolute",
            top: CANVAS_W * 0.55,
            left: CANVAS_W * 0.35,
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

// ── Banner Slide (horizontal, for GitHub README) ─────────
const BANNER_W = 2560;
const BANNER_H = 860;

function BannerSlide({ id }: SlideProps) {
  const phoneW = BANNER_H * 0.55;
  const tags = ["Quick Entry", "Tags", "Analysis", "Budget Goals", "Monthly Trends"];
  const contentW = BANNER_W * 0.78;
  return (
    <div
      id={id}
      style={{
        width: BANNER_W,
        height: BANNER_H,
        background: BG_WARM,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: BANNER_H * 0.012,
          background: BRAND_BLUE,
          zIndex: 10,
        }}
      />
      {/* Centered inner wrapper */}
      <div
        style={{
          width: contentW,
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {/* Left: phone — top aligns with logo area, bottom clipped */}
        <Phone
          screenshot="/screenshots/bills_mobile.png"
          width={phoneW}
          style={{
            flexShrink: 0,
            alignSelf: "flex-start",
            marginTop: BANNER_H * 0.18,
          }}
        />

        {/* Right: text content — vertically centered */}
        <div
          style={{
            flex: 1,
            paddingLeft: BANNER_W * 0.03,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: phoneW,
            right: 0,
            gap: BANNER_H * 0.03,
          }}
        >
        {/* Logo + App name */}
        <div style={{ display: "flex", alignItems: "center", gap: BANNER_W * 0.008 }}>
          <img
            src={img("/logo.svg")}
            alt=""
            style={{ width: BANNER_H * 0.12, height: BANNER_H * 0.12, borderRadius: BANNER_H * 0.025 }}
          />
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: BANNER_H * 0.06,
              fontWeight: 600,
              color: TEXT_MUTED,
              letterSpacing: "0.01em",
            }}
          >
            iSpent
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: BANNER_H * 0.17,
            fontWeight: 400,
            color: TEXT_DARK,
            lineHeight: 1.05,
          }}
        >
          Spend with{" "}
          <span style={{ color: BRAND_BLUE, fontStyle: "italic" }}>clarity.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: BANNER_H * 0.04,
            fontWeight: 400,
            color: TEXT_MUTED,
            lineHeight: 1.4,
          }}
        >
          A modern finance tracker that turns daily bookkeeping into an effortless habit.
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: BANNER_H * 0.022,
            marginTop: BANNER_H * 0.01,
          }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                fontFamily: FONT_SANS,
                fontSize: BANNER_H * 0.035,
                fontWeight: 500,
                color: TEXT_DARK,
                padding: `${BANNER_H * 0.015}px ${BANNER_H * 0.035}px`,
                border: `1.5px solid ${TEXT_MUTED}40`,
                borderRadius: BANNER_H * 0.06,
                background: "rgba(255,255,255,0.5)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { Component: Slide1, name: "01-hero" },
  { Component: Slide5, name: "02-quick-entry" },
  { Component: Slide3, name: "03-analysis" },
  { Component: Slide4, name: "04-goals" },
];

// ── Main Page ─────────────────────────────────────────────
export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");

  useEffect(() => {
    Promise.all(IMAGE_PATHS.map(preloadImage)).then(() => setLoaded(true));
  }, []);

  const exportSlide = useCallback(async (elId: string, w: number, h: number, filename: string) => {
    const el = document.getElementById(elId);
    if (!el) return;
    await toPng(el, { width: w, height: h, pixelRatio: 1 });
    await new Promise((r) => setTimeout(r, 300));
    const dataUrl = await toPng(el, { width: w, height: h, pixelRatio: 1 });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
    await new Promise((r) => setTimeout(r, 300));
  }, []);

  const exportAll = useCallback(async () => {
    setExporting(true);
    const total = SLIDES.length + 1;
    // Export banner first
    setExportStatus(`Exporting banner... (1/${total})`);
    await exportSlide("slide-banner", BANNER_W, BANNER_H, "00-banner.png");
    // Export vertical slides
    for (let i = 0; i < SLIDES.length; i++) {
      setExportStatus(`Exporting ${SLIDES[i].name}... (${i + 2}/${total})`);
      await exportSlide(`slide-${i}`, CANVAS_W, CANVAS_H, `${SLIDES[i].name}.png`);
    }
    setExportStatus("Done!");
    setExporting(false);
  }, [exportSlide]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">iSpent Screenshot Generator</h1>
        <button
          onClick={exportAll}
          disabled={exporting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {exporting ? exportStatus : "Export All PNGs"}
        </button>
      </div>

      {/* Banner preview */}
      <div className="mb-8">
        <div className="flex flex-col items-start gap-2">
          <div
            style={{
              width: 960,
              height: (BANNER_H / BANNER_W) * 960,
              overflow: "hidden",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ transform: `scale(${960 / BANNER_W})`, transformOrigin: "top left" }}>
              <BannerSlide id="slide-banner" />
            </div>
          </div>
          <span className="text-sm text-gray-500 font-medium">00-banner</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {SLIDES.map((slide, i) => {
          const scale = 320 / CANVAS_W;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: 320,
                  height: CANVAS_H * scale,
                  overflow: "hidden",
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <slide.Component id={`slide-${i}`} />
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">{slide.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
