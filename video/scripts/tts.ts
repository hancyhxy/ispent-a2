/* Author: Xinyi */
/*
 * Generate voiceover clips for the iSpent demo with Fish Audio TTS.
 *
 * SECURITY: the API key is read ONLY from process.env.FISH_AUDIO_API_KEY — it is
 * never written to a file, logged, or hard-coded here. Run it by injecting the
 * key from the macOS Keychain for the lifetime of one command, e.g.:
 *
 *   FISH_AUDIO_API_KEY=$(security find-generic-password -s speakly-fish-audio -a "$USER" -w) \
 *     bun run scripts/tts.ts
 *
 * Output: one mp3 per line into public/audio/<id>.mp3. The caption text in
 * Demo.tsx and the `text` here are kept identical so audio and subtitles match.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.FISH_AUDIO_API_KEY;
if (!API_KEY) {
  console.error(
    "FISH_AUDIO_API_KEY is not set. Inject it from the Keychain for this command — " +
      "do not put the key in any file.",
  );
  process.exit(1);
}

// Fish Audio TTS endpoint + model. s2-pro is selected via the `model` header.
const ENDPOINT = "https://api.fish.audio/v1/tts";
const MODEL = "s2-pro";
// A neutral, professional English reference voice. Override with FISH_VOICE_ID
// if a specific cloned/library voice is preferred.
const REFERENCE_ID = process.env.FISH_VOICE_ID || "";

// The 14 narrated lines, keyed by the Demo.tsx section id. Text === caption text.
// Title cards introA + introB are narrated; outroC + outroD stay silent.
const LINES: { id: string; text: string }[] = [
  { id: "introA", text: "Welcome to iSpent." },
  { id: "introB", text: "iSpent — built to walk with you, every step of the way." },
  { id: "login", text: "Sign-in is email-first, secured with hashed passwords and a JSON Web Token — every account's data stays private." },
  { id: "tour1", text: "The first time you log in, iSpent walks you through itself." },
  { id: "tour2", text: "Bills is where you log your day-to-day income and expenses." },
  { id: "tour3", text: "Analysis turns those records into charts." },
  { id: "tour4", text: "And Goals is where you set what you're saving for." },
  { id: "tour5", text: "And the whole app flips between light and dark with one tap." },
  { id: "billsadd", text: "Adding a transaction takes seconds: pick a category, type an amount, add a note, and save." },
  { id: "goalloop", text: "That food expense automatically moved my Eating Out limit forward — every entry pushes the matching goal." },
  { id: "goals3", text: "Goals come in three shapes: a savings target, a spending limit, and a simple financial to-do." },
  { id: "analysis", text: "The Analysis page answers where it all went — a category breakdown, a daily trend, and a ranking, live from your records." },
  { id: "switch", text: "Sign out, and back in as an administrator." },
  { id: "admin", text: "Admins get an extra tab — manage every account and review a full activity log, every login and change recorded automatically." },
];

const OUT_DIR = join(SCRIPT_DIR, "..", "public", "audio");

async function synth(text: string): Promise<Buffer> {
  const body: Record<string, unknown> = {
    text,
    format: "mp3",
    // Light, natural pacing for narration.
    chunk_length: 200,
    normalize: true,
  };
  if (REFERENCE_ID) body.reference_id = REFERENCE_ID;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      model: MODEL,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Fish TTS ${res.status} ${res.statusText} — ${detail.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  // Optional: synth only one id, e.g. `bun run scripts/tts.ts introA`
  const only = process.argv[2];
  const work = only ? LINES.filter((l) => l.id === only) : LINES;
  if (only && work.length === 0) {
    console.error(`No line with id "${only}".`);
    process.exit(1);
  }

  for (const { id, text } of work) {
    process.stdout.write(`  ${id} … `);
    try {
      const audio = await synth(text);
      await writeFile(join(OUT_DIR, `${id}.mp3`), audio);
      console.log(`ok (${(audio.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.log("FAILED");
      console.error(`    ${(err as Error).message}`);
      process.exitCode = 1;
    }
  }
}

main();
