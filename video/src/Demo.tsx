/* Author: Xinyi */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  Screenshot,
  Stage,
  toCanvas,
  WIN_X,
  WIN_Y,
  WIN_W,
  WIN_H,
  WIN_RADIUS,
} from "./components/Screenshot";
import { Caption } from "./components/Caption";
import { Cursor } from "./components/Cursor";
import { GoalCardLive } from "./components/GoalCardLive";
import { TitleCard } from "./components/TitleCard";

/*
 * iSpent demo — screenshot-driven, code-animated, no live screen recording.
 *
 * Structure (per VIDEO_SCRIPT.md, account = xinyi.han@ispent.app for §0–6,
 * switching to admin@ispent.app for the Admin section so the 4th nav tab is
 * explained rather than appearing from nowhere):
 *
 *   intro cards (black) → login → 6-step tour (incl. dark-mode flip) →
 *   Bills + Add Record → live goal bump → Goals → Analysis →
 *   sign out → sign in as admin → Admin → outro cards (black)
 *
 * Framing rules: the app is a rounded floating window on a near-black stage,
 * captions are white in the dark margin below it, NO zoom, NO highlight rings.
 * The only motion is cross-fades, the modal pop, the cursor, and the goal bump.
 * Title cards are pure-black bookends that contrast with the in-app sections.
 */

const FADE = 18;

// All click targets are measured in the live 1512x916 viewport (CSS px) and
// mapped into the window with toCanvas(). Re-measured after the viewport moved
// from 1920 to 1512 — the old coords pointed off-screen.
const COORD = {
  loginContinue: { x: 756, y: 565 }, // login card "Continue" button
  themeToggle: { x: 74, y: 836 }, // sidebar theme toggle
  addRecord: { x: 1413, y: 100 }, // Bills "Add Record" button
  signOut: { x: 74, y: 880 }, // sidebar "Sign out"
};

// A modal screenshot popping up over the window: spring + fade in the modal
// shot (which already carries its own dimmed backdrop), clipped to the window's
// rounded rect so nothing bleeds onto the dark stage.
const ModalPop: React.FC<{ src: string; at: number }> = ({ src, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ fps, frame: frame - at, config: { damping: 16, mass: 0.7 } });
  const scale = interpolate(t, [0, 1], [0.92, 1]);
  const opacity = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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
        opacity,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
};

// A reusable dim layer clipped to the window's rounded rect (for backdrops).
const WindowDim: React.FC<{ alpha?: number }> = ({ alpha = 0.55 }) => (
  <div
    style={{
      position: "absolute",
      left: WIN_X,
      top: WIN_Y,
      width: WIN_W,
      height: WIN_H,
      borderRadius: WIN_RADIUS,
      background: `rgba(13,13,15,${alpha})`,
    }}
  />
);

// ---------------------------------------------------------------------------
// Intro cards (pure black bookends)
// ---------------------------------------------------------------------------
const IntroA: React.FC<{ dur: number }> = ({ dur }) => (
  <TitleCard title="Welcome to iSpent" titleSize={76} durationInFrames={dur} />
);

const IntroB: React.FC<{ dur: number }> = ({ dur }) => (
  <TitleCard
    title="iSpent"
    subtitle="Built to walk with you, every step of the way."
    titleSize={68}
    durationInFrames={dur}
  />
);

// ---------------------------------------------------------------------------
// 1 · Login — cursor to Continue (account: xinyi.han@ispent.app)
// ---------------------------------------------------------------------------
const Login: React.FC<{ dur: number }> = ({ dur }) => {
  const cont = toCanvas(COORD.loginContinue.x, COORD.loginContinue.y);
  return (
    <Stage>
      <Screenshot src="shots/01-login.png" />
      <Cursor from={toCanvas(700, 760)} to={cont} moveStart={10} moveDuration={36} clickAt={50} />
      <Caption
        text="Sign-in is email-first, secured with hashed passwords and a JSON Web Token — every account's data stays private."
        durationInFrames={dur}
      />
    </Stage>
  );
};

// ---------------------------------------------------------------------------
// 2 · Onboarding — the real app's 6-step spotlight tour
// ---------------------------------------------------------------------------
const tourStep = (src: string, text: string, dur: number) => (
  <Stage>
    <Screenshot src={src} />
    <Caption text={text} durationInFrames={dur} />
  </Stage>
);

// Step 5 flips the theme on screen: cursor to the toggle, then the light shot
// cross-fades to the dark shot — the WHOLE UI re-themes, tour bubble included.
const OnboardingDarkSwap: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const toggle = toCanvas(COORD.themeToggle.x, COORD.themeToggle.y);
  const CLICK = 40;
  const darkOpacity = interpolate(frame, [CLICK, CLICK + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Stage>
      <Screenshot src="shots/tour-5-darkmode-light.png" />
      <div style={{ opacity: darkOpacity }}>
        <Screenshot src="shots/tour-5-darkmode-dark.png" />
      </div>
      <Cursor from={toCanvas(300, 600)} to={toggle} moveStart={4} moveDuration={30} clickAt={CLICK} />
      <Caption
        text="And the whole app flips between light and dark with one tap."
        durationInFrames={dur}
      />
    </Stage>
  );
};

// ---------------------------------------------------------------------------
// 3 · Bills + Add Record — cursor to the button, modal pops up
// ---------------------------------------------------------------------------
const BillsAdd: React.FC<{ dur: number }> = ({ dur }) => {
  const addBtn = toCanvas(COORD.addRecord.x, COORD.addRecord.y);
  const MODAL_AT = 60;
  return (
    <Stage>
      <Screenshot src="shots/02-bills.png" />
      <Cursor from={toCanvas(820, 760)} to={addBtn} moveStart={10} moveDuration={40} clickAt={MODAL_AT - 4} />
      <ModalPop src="shots/03-addrecord-filled.png" at={MODAL_AT} />
      <Caption
        text="Adding a transaction takes seconds: pick a category, type an amount, add a note, and save."
        durationInFrames={dur}
      />
    </Stage>
  );
};

// ---------------------------------------------------------------------------
// 4 · Core loop — the food expense bumps the Eating Out limit, live
// ---------------------------------------------------------------------------
const GoalLoop: React.FC<{ dur: number }> = ({ dur }) => (
  <Stage>
    <Screenshot src="shots/04-goals.png" />
    <WindowDim />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <GoalCardLive bumpAt={28} />
    </AbsoluteFill>
    <Caption
      text="That food expense automatically moved my Eating Out limit forward — every entry pushes the matching goal."
      durationInFrames={dur}
    />
  </Stage>
);

// ---------------------------------------------------------------------------
// 5 · Goals — three card types
// ---------------------------------------------------------------------------
const GoalsThree: React.FC<{ dur: number }> = ({ dur }) => (
  <Stage>
    <Screenshot src="shots/04-goals.png" />
    <Caption
      text="Goals come in three shapes: a savings target, a spending limit, and a simple financial to-do."
      durationInFrames={dur}
    />
  </Stage>
);

// ---------------------------------------------------------------------------
// 6 · Analysis
// ---------------------------------------------------------------------------
const Analysis: React.FC<{ dur: number }> = ({ dur }) => (
  <Stage>
    <Screenshot src="shots/06-analysis.png" />
    <Caption
      text="The Analysis page answers where it all went — a category breakdown, a daily trend, and a ranking, live from your records."
      durationInFrames={dur}
    />
  </Stage>
);

// ---------------------------------------------------------------------------
// 7a · Account switch — sign out (cursor) → cross-fade to admin login step 2
// ---------------------------------------------------------------------------
const AccountSwitch: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const signOut = toCanvas(COORD.signOut.x, COORD.signOut.y);
  const SWAP = 56; // frame at which Bills cross-fades to the admin login shot
  const loginOpacity = interpolate(frame, [SWAP, SWAP + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Stage>
      <Screenshot src="shots/02-bills.png" />
      <Cursor from={toCanvas(700, 600)} to={signOut} moveStart={6} moveDuration={36} clickAt={46} />
      <div style={{ opacity: loginOpacity }}>
        <Screenshot src="shots/admin-login-password.png" />
      </div>
      <Caption text="Sign out, and back in as an administrator." durationInFrames={dur} />
    </Stage>
  );
};

// ---------------------------------------------------------------------------
// 7b · Admin dashboard — the 4th "Admin" tab is the payoff of the switch
// ---------------------------------------------------------------------------
const Admin: React.FC<{ dur: number }> = ({ dur }) => (
  <Stage>
    <Screenshot src="shots/07-admin.png" />
    <Caption
      text="Admins get an extra tab — manage every account and review a full activity log, every login and change recorded automatically."
      durationInFrames={dur}
    />
  </Stage>
);

// ---------------------------------------------------------------------------
// Outro cards (pure black bookends)
// ---------------------------------------------------------------------------
const OutroC: React.FC<{ dur: number }> = ({ dur }) => (
  <TitleCard
    title="iSpent"
    subtitle="Track → analyse → stay on goal."
    titleSize={84}
    durationInFrames={dur}
  />
);

const OutroD: React.FC<{ dur: number }> = ({ dur }) => (
  <TitleCard title="by XINYI HAN" titleSize={56} durationInFrames={dur} />
);

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------
// Durations are calibrated to the generated voiceover: each narrated section is
// `audio frames + 26` (≈8 frames lead-in so the visuals settle, ≈18 trailing so
// the line finishes before the cross-fade). outroC/D are silent title cards.
// `audio` is the public/audio/<id>.mp3 clip; sections without it play silent.
export const SECTIONS = [
  { id: "introA", dur: 80, audio: "audio/introA.mp3", node: (d: number) => <IntroA dur={d} /> },
  { id: "introB", dur: 123, audio: "audio/introB.mp3", node: (d: number) => <IntroB dur={d} /> },
  { id: "login", dur: 237, audio: "audio/login.mp3", node: (d: number) => <Login dur={d} /> },
  { id: "tour1", dur: 124, audio: "audio/tour1.mp3", node: (d: number) => tourStep("shots/tour-1-welcome.png", "The first time you log in, iSpent walks you through itself.", d) },
  { id: "tour2", dur: 146, audio: "audio/tour2.mp3", node: (d: number) => tourStep("shots/tour-2-bills.png", "Bills is where you log your day-to-day income and expenses.", d) },
  { id: "tour3", dur: 106, audio: "audio/tour3.mp3", node: (d: number) => tourStep("shots/tour-3-analysis.png", "Analysis turns those records into charts.", d) },
  { id: "tour4", dur: 103, audio: "audio/tour4.mp3", node: (d: number) => tourStep("shots/tour-4-goals.png", "And Goals is where you set what you're saving for.", d) },
  { id: "tour5", dur: 137, audio: "audio/tour5.mp3", node: (d: number) => <OnboardingDarkSwap dur={d} /> },
  { id: "billsadd", dur: 201, audio: "audio/billsadd.mp3", node: (d: number) => <BillsAdd dur={d} /> },
  { id: "goalloop", dur: 219, audio: "audio/goalloop.mp3", node: (d: number) => <GoalLoop dur={d} /> },
  { id: "goals3", dur: 207, audio: "audio/goals3.mp3", node: (d: number) => <GoalsThree dur={d} /> },
  { id: "analysis", dur: 262, audio: "audio/analysis.mp3", node: (d: number) => <Analysis dur={d} /> },
  { id: "switch", dur: 115, audio: "audio/switch.mp3", node: (d: number) => <AccountSwitch dur={d} /> },
  { id: "admin", dur: 284, audio: "audio/admin.mp3", node: (d: number) => <Admin dur={d} /> },
  { id: "outroC", dur: 100, audio: null, node: (d: number) => <OutroC dur={d} /> },
  { id: "outroD", dur: 80, audio: null, node: (d: number) => <OutroD dur={d} /> },
] as const;

export const DEMO_DURATION =
  SECTIONS.reduce((sum, s) => sum + s.dur, 0) - FADE * (SECTIONS.length - 1);

export const Demo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <TransitionSeries>
        {SECTIONS.map((s, i) => (
          <React.Fragment key={s.id}>
            <TransitionSeries.Sequence durationInFrames={s.dur}>
              {s.node(s.dur)}
              {s.audio && <Audio src={staticFile(s.audio)} />}
            </TransitionSeries.Sequence>
            {i < SECTIONS.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: FADE })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
