/* Author: Xinyi */
import { useState, useEffect, useLayoutEffect, useCallback } from 'react';

/*
 * OnboardingTour — a first-run guided walkthrough.
 *
 * Design notes
 * ------------
 * - Spotlight without a clip-path: the highlighted element is framed by a
 *   transparent box that casts a single huge semi-transparent box-shadow.
 *   That shadow IS the dimming overlay, so the framed element stays bright
 *   while everything around it darkens — and the cut-out inherits the
 *   frame's border-radius for free. One element does both jobs.
 * - Steps that live on another page tell App which page to switch to
 *   (via onNavigate) before they run, so the highlight always has a real
 *   target on screen. A step with no `target` renders as a centered card
 *   (used for the welcome and the closing step).
 * - Positions are measured with getBoundingClientRect on every step change
 *   and on resize, so the spotlight tracks the responsive layout (sidebar
 *   on desktop, bottom bar on mobile share the same data-tour anchors).
 * - Theme-agnostic: built entirely from the app's semantic Tailwind tokens
 *   (bg-card / text-* / shadow-pop), so it re-themes with the rest of the UI.
 */

// localStorage flag — set once the user finishes or skips, so the tour
// never auto-opens again. Exported so the Help button can clear it.
export const TOUR_FLAG = 'ispent_tour_done';

export function hasSeenTour() {
  try {
    return localStorage.getItem(TOUR_FLAG) === '1';
  } catch {
    // Private mode / storage disabled: treat as "seen" so we never trap
    // the user in a tour that can't remember being dismissed.
    return true;
  }
}

function markTourSeen() {
  try {
    localStorage.setItem(TOUR_FLAG, '1');
  } catch {
    /* storage unavailable — nothing to persist, fail silently */
  }
}

// Each step optionally names a page to switch to and a data-tour anchor to
// highlight. `target: null` => a centered card with no spotlight.
const STEPS = [
  {
    page: null,
    target: null,
    title: 'Welcome to iSpent 👋',
    body: 'A goal-driven finance tracker. Let me show you around in 20 seconds — log an expense, see where your money goes, and stay on track toward your goals.',
  },
  {
    page: 'bills',
    target: 'nav-bills',
    title: 'Bills — log it in seconds',
    body: 'Your day-to-day income and expenses live here, grouped by date. Tap “Add Record” to log a transaction with a category and a quick note.',
  },
  {
    page: 'analysis',
    target: 'nav-analysis',
    title: 'Analysis — where it goes',
    body: 'A category donut, a daily-spend trend, and a category ranking turn your records into a picture at a glance.',
  },
  {
    page: 'goals',
    target: 'nav-goals',
    title: 'Goals — stay on track',
    body: 'Set a savings target, a spending limit, or a simple financial to-do. Every record you log moves the matching goal forward automatically.',
  },
  {
    page: null,
    target: 'theme-toggle',
    title: 'Dark mode, one tap',
    body: 'Prefer a darker canvas? Flip the whole app between light and dark from here anytime.',
  },
  {
    page: null,
    target: null,
    title: "You're all set 🎉",
    body: 'That’s the whole loop: track → analyse → stay on goal. You can reopen this tour anytime from the “?” help button.',
  },
];

// Padding around the highlighted element so the spotlight breathes a little.
const SPOTLIGHT_PAD = 8;
// Gap between the highlighted element and the speech bubble.
const BUBBLE_GAP = 14;
const BUBBLE_WIDTH = 320;

export default function OnboardingTour({ onClose, onNavigate }) {
  const [stepIndex, setStepIndex] = useState(0);
  // Bounding rect of the current target element (null => centered card).
  const [rect, setRect] = useState(null);

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const finish = useCallback(() => {
    markTourSeen();
    onClose();
  }, [onClose]);

  // When a step wants a different page, switch to it first so the anchor
  // exists in the DOM before we try to measure it.
  useEffect(() => {
    if (step.page && onNavigate) onNavigate(step.page);
  }, [step.page, onNavigate]);

  // Measure the target after layout (and on resize). useLayoutEffect so the
  // spotlight is painted in its final spot, never a one-frame flash at 0,0.
  useLayoutEffect(() => {
    if (!step.target) {
      setRect(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        // Anchor not mounted (e.g. theme toggle hidden on mobile): fall
        // back to a centered card rather than highlighting nothing.
        setRect(null);
      }
    };

    // A short delay lets a page switch finish rendering before we measure.
    const t = setTimeout(measure, step.page ? 120 : 0);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [step.target, step.page, stepIndex]);

  // Advance one step; advancing past the last step finishes the tour.
  // The last-step check happens inside the functional update against the
  // freshest index, not a captured `isLast`, so rapid repeated calls (e.g.
  // holding ArrowRight) can never push the index out of bounds.
  const next = useCallback(() => {
    setStepIndex((i) => {
      if (i >= STEPS.length - 1) {
        finish();
        return i;
      }
      return i + 1;
    });
  }, [finish]);

  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  // Keyboard: Esc skips the tour, arrows/Enter advance.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, finish]);

  // ---- Spotlight geometry --------------------------------------------------
  // The transparent frame around the target; its giant box-shadow dims the
  // rest of the screen. When there's no target we render a plain dim overlay
  // instead (centered-card steps).
  const spotlight = rect
    ? {
        position: 'fixed',
        top: rect.top - SPOTLIGHT_PAD,
        left: rect.left - SPOTLIGHT_PAD,
        width: rect.width + SPOTLIGHT_PAD * 2,
        height: rect.height + SPOTLIGHT_PAD * 2,
        borderRadius: 16,
        boxShadow: '0 0 0 9999px rgba(15, 17, 23, 0.66)',
        pointerEvents: 'none',
        transition: 'all 0.25s ease',
        zIndex: 60,
      }
    : null;

  // ---- Bubble placement ----------------------------------------------------
  // Centered card when there's no target; otherwise place the bubble below
  // the target, or above it if there isn't room below.
  let bubbleStyle;
  if (!rect) {
    bubbleStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: BUBBLE_WIDTH,
      maxWidth: 'calc(100vw - 32px)',
      zIndex: 61,
    };
  } else {
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeBelow = spaceBelow > 220;
    const top = placeBelow
      ? rect.bottom + BUBBLE_GAP
      : rect.top - BUBBLE_GAP;
    // Keep the bubble on-screen horizontally.
    let left = rect.left;
    if (left + BUBBLE_WIDTH > window.innerWidth - 16) {
      left = window.innerWidth - BUBBLE_WIDTH - 16;
    }
    if (left < 16) left = 16;
    bubbleStyle = {
      position: 'fixed',
      top,
      left,
      width: BUBBLE_WIDTH,
      maxWidth: 'calc(100vw - 32px)',
      transform: placeBelow ? 'none' : 'translateY(-100%)',
      zIndex: 61,
      transition: 'all 0.25s ease',
    };
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product tour"
      className="fixed inset-0"
      style={{ zIndex: 59 }}
    >
      {/* Dim overlay for centered-card steps (no spotlight element).
          Clicking it skips the tour, matching modal-dismiss conventions. */}
      {!rect && (
        <div
          className="fixed inset-0"
          style={{ background: 'rgba(15, 17, 23, 0.66)', zIndex: 60 }}
          onClick={finish}
        />
      )}

      {/* Spotlight frame (its box-shadow is the dimming layer) */}
      {spotlight && <div style={spotlight} />}

      {/* Speech bubble / card */}
      <div
        style={bubbleStyle}
        className="bg-card rounded-2xl p-5 text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-muted">
            {stepIndex + 1} / {STEPS.length}
          </span>
          <button
            onClick={finish}
            className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip
          </button>
        </div>

        <h3 className="text-base font-bold text-text-primary mb-1.5">
          {step.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {step.body}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex ? 'w-5 bg-primary' : 'w-1.5 bg-[var(--c-border)]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={back}
            disabled={isFirst}
            className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-text-secondary
              bg-surface hover:bg-[var(--c-hover)] transition-colors
              disabled:opacity-0 disabled:pointer-events-none"
          >
            Back
          </button>
          <button
            onClick={next}
            className="px-6 py-2.5 rounded-2xl text-sm font-semibold text-white
              bg-primary hover:bg-primary-light transition-colors"
          >
            {isLast ? 'Get started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
