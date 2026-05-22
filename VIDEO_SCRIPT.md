# iSpent — Demo Video Script & Production Spec

> UTS Internet Programming · Assignment 2 · Demo recording (≤ 3 minutes)
>
> This is the build spec for the Remotion video (`video/`). It is screenshot-driven
> with code animation — no live screen recording. Each section lists its screenshot
> source, the on-screen motion, and the verbatim caption/voiceover line.

---

## Global production rules (apply to every section)

These were settled during review and must hold throughout:

1. **Framing — dark stage + floating window.** The app screenshot is shown as a
   rounded-corner window (≈86% width) floating on a dark canvas (`#0D0D0F`), with
   a soft shadow. It is **never** shown full-bleed.
2. **Captions — white text in the dark margin below the window.** No background
   band; a soft text-shadow for legibility. Caption text = the voiceover line.
3. **No zoom (this version).** No Ken Burns, no focus zoom. The frame is still.
   (Action-zoom may be added in a later pass; not now.)
4. **No highlight rings.** Do not draw boxes over the screenshot to point at
   things. If something needs emphasis, say it in the caption.
5. **Account continuity.** The nav has 3 tabs for a normal user
   (Bills / Analysis / Goals) and a 4th (Admin) only for an admin. The video must
   never make the Admin tab "appear from nowhere": the main walkthrough uses the
   **Xinyi Han** user account; before the Admin section we show a
   **sign-out → sign-in as admin** transition so the extra tab is explained.
   - Normal user: **xinyi.han@ispent.app** (name: *Xinyi Han*)
   - Admin user: **admin@ispent.app**
6. **Black title cards bookend the demo.** Pure-black (`#000`) full-frame cards
   with centred white text open and close the video (intro hook + slogan; brand
   + author). They contrast with the in-app sections (window on `#0D0D0F`) so the
   cuts read as chapter breaks.
7. **Motion that IS kept:** scene cross-fades; the Add Record modal spring-pop;
   the animated cursor (move + click ripple); the live goal-bump card; the
   account-switch cross-fade.
8. **Canvas** 1920×1080 @30fps. Source shots captured at a 1512×916 viewport
   (a normal desktop-web ratio), placed in the window at native aspect. Click
   targets are measured in that 1512×916 viewport and mapped via `toCanvas()`.
9. **Voiceover** Fish Audio TTS (model `s2-pro`); the caption text and the TTS
   text are identical so they stay in sync.

---

## 0 · Intro title cards (black)

Two pure-black cards open the demo (no app screenshot yet).

| Card | Title | Subtitle |
|------|-------|----------|
| A | **Welcome to iSpent** | — |
| B | **iSpent** | Built to walk with you, every step of the way. |

**Motion:** white text fades up with a tiny scale, holds, fades out.

---

## 1 · Login (as Xinyi Han)

**Screenshot:** `01-login.png` (email field pre-filled with `xinyi.han@ispent.app`).
**Motion:** cursor moves to **Continue** and clicks. (Typing is skipped.)
**Account:** signing in as **xinyi.han@ispent.app**.

> Sign-in is email-first, secured with hashed passwords and a JSON Web Token —
> every account's data stays private.

---

## 2 · Onboarding — the 6-step spotlight tour

The real app's first-run tour. Each step is the app's own screenshot (the
spotlight is already in the shot). Step 5 flips the theme on screen.

| Step | Screenshot | Caption |
|------|-----------|---------|
| 1 | `tour-1-welcome.png` | The first time you log in, iSpent walks you through itself. |
| 2 | `tour-2-bills.png` | Bills is where you log your day-to-day income and expenses. |
| 3 | `tour-3-analysis.png` | Analysis turns those records into charts. |
| 4 | `tour-4-goals.png` | And Goals is where you set what you're saving for. |
| 5 | `tour-5-darkmode-light.png` → `tour-5-darkmode-dark.png` | And the whole app flips between light and dark with one tap. |
| 6 | `tour-6-allset.png` | *(optional — may be folded into the transition out)* |

**Step 5 motion:** cursor moves to the theme toggle (sidebar footer) and clicks;
the light shot cross-fades to the dark shot — the **entire** UI re-themes, the
tour bubble card included (verified: it uses the app's semantic tokens).

---

## 3 · Bills + Add Record

**Screenshot:** `02-bills.png` (clean) with `03-addrecord-filled.png` popping over.
**Motion:** cursor moves to **Add Record**; the modal spring-pops in (scale +
fade), clipped to the window's rounded rect.

> Adding a transaction takes seconds: pick a category, type an amount, add a note,
> and save.

---

## 4 · The core loop — one entry moves a goal (live)

**Screenshot:** `04-goals.png` dimmed as a backdrop.
**Motion:** a re-created **Eating Out** card animates the spent amount counting up
**$158.50 → $171.30** and the progress bar growing **40% → ~43%** (matching the
$12.80 food expense from §3). This is code, not a screenshot, so the cause-and-
effect is exact.

> That food expense automatically moved my Eating Out limit forward — every entry
> pushes the matching goal, so you always see real progress.

---

## 5 · Goals — three card types

**Screenshot:** `04-goals.png` (still).

> Goals come in three shapes: a savings target, a spending limit, and a simple
> financial to-do.

---

## 6 · Analysis — where it goes

**Screenshot:** `06-analysis.png` (still; no highlight ring).

> The Analysis page answers where it all went — a category breakdown, a daily
> trend, and a ranking, all live from your records.

---

## 7 · Switch to admin → Admin dashboard

**This section opens with the account-switch transition (rule 5).**

**7a · Sign out → sign in as admin** (`AccountSwitch` component)
- **Screenshot(s):** `02-bills.png` (cursor moves to **Sign out** in the sidebar,
  clicks) → cross-fade to `admin-login-password.png` (login step 2 showing
  *Signing in as admin@ispent.app*, password masked with dots).
- **Motion:** cursor click on Sign out, then the Bills shot cross-fades to the
  admin login shot — the viewer sees the identity change from Xinyi Han to admin.

> Sign out, and back in as an administrator.

**7b · Admin dashboard**
- **Screenshot:** `07-admin.png` — the nav now shows the **4th "Admin" tab**, the
  payoff of the switch. The activity log shows the real demo session's events,
  all attributed to `xinyi.han@ispent.app` and `admin@ispent.app`.

> Admins get an extra tab — manage every account and review a full activity log,
> every login and change recorded automatically.

---

## 8 · Outro title cards (black)

Two pure-black cards close the demo (mirroring the intro).

| Card | Title | Subtitle |
|------|-------|----------|
| C | **iSpent** | Track → analyse → stay on goal. |
| D | **by XINYI HAN** | — |

**Motion:** white text fades up with a tiny scale, holds, fades out.

---

## Asset checklist (what to (re)capture)

All at the 1512×916 viewport, light theme unless noted. All recaptured after the
account became **Xinyi Han** (banner reads "Good Afternoon, Xinyi Han").

- [x] `01-login.png` — login page, email pre-filled `xinyi.han@ispent.app`
- [x] `02-bills.png` — Bills page (Xinyi Han, has data)
- [x] `03-addrecord-filled.png` — Add Record modal, filled (Food / $12.80 / "Lunch at campus")
- [x] `04-goals.png` — Goals page (Xinyi Han, Eating Out $158.50 / $400 / 40%)
- [x] `06-analysis.png` — Analysis page (Xinyi Han)
- [x] `07-admin.png` — Admin dashboard (admin view; log shows xinyi.han + admin)
- [x] `tour-1..6` — onboarding steps (incl. tour-5 light + dark)
- [x] `admin-login-password.png` — login step 2 as admin@ispent.app, password masked

## UI fixes already applied (so screenshots reflect them)

- Admin dashboard title: removed the misaligned shield icon → plain text title
  (consistent with the other pages, which have no title icon).
- Goals & Admin pages: removed `max-w-6xl mx-auto` so their horizontal margins
  match Bills / Analysis.
