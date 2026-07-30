// scripts/generate-category-content.js
// Run locally: node scripts/generate-category-content.js
// .env.local లో GROQ_API_KEY ఉండాలి (already ఉంది generate-game-content.js కోసం)

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OUTPUT_PATH = path.join(__dirname, "../data/category-content.json");
const DELAY_MS = 2200;

const CATEGORIES = [
  "2048", "action", "addictive", "adventure", "airplane", "animal",
  "arcade", "archery", "ball", "basketball", "baseball", "battle",
  "battle-royale", "bike", "block", "board", "brain", "building", "car",
  "card", "casual", "cats", "chess", "christmas", "clicker", "cooking",
  "dirt-bike", "dinosaur", "drawing", "dress-up", "drifting", "driving",
  "educational", "escape", "family", "farming", "fashion", "fighting",
  "fire-and-water", "first-person-shooter", "fishing", "flash", "flight",
  "fun", "games-for-girls", "gangster", "gdevelop", "golf", "granny",
  "gun", "hair-salon", "halloween", "helicopter", "hidden-object",
  "hockey", "horror", "horse", "hunting", "hyper-casual", "idle", "io",
  "jigsaw-puzzles", "jumping", "junior", "kids", "knight", "mahjong",
  "makeup", "management", "mario", "match-3", "math", "memory",
  "mermaid", "minecraft", "mining", "mmorpg", "mobile", "money",
  "monster", "multiplayer", "music", "naval", "ninja", "ninja-turtle",
  "offroad", "open-world", "parking", "parkour", "piano", "pirates",
  "pixel", "platformer", "police", "pool", "princess", "puzzle",
  "racing", "restaurant", "retro", "robots", "rpg", "runner", "scary",
  "scrabble", "sharks", "shooter", "simulation", "skateboard",
  "skibidi-toilet", "skill", "snake", "sniper", "soccer", "solitaire",
  "spinner", "sports", "stickman", "strategy", "surgery", "survival",
  "sword", "tanks", "tap", "tetris", "trivia", "truck", "two-player",
  "tycoon", "war", "word", "world-cup", "worm", "wrestling", "zombie",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatName(id) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function generateContent(categoryName, retries = 5) {
  const prompt = `You are writing SEO-friendly content for a category page on a free browser games website called LokaYantra.

Category: ${categoryName} Games

Return ONLY valid JSON, no markdown, no code fences, no explanation, matching exactly this shape:
{
  "intro": "A natural, 100-150 word paragraph describing this category of games in general terms — what makes this genre fun, what kind of skills or gameplay players can expect, and why someone might enjoy these games. Written for a general games website, not for any specific title. Mention that all games are free to play instantly in the browser with no downloads.",
  "highlights": ["short phrase 1 describing a common gameplay element in this genre", "short phrase 2", "short phrase 3", "short phrase 4"],
  "subgenres": [
    {"name": "a common sub-style within this genre (e.g. for Adventure: 'Platform Adventures')", "desc": "1-2 sentence description of what this sub-style involves, general terms only"},
    {"name": "another sub-style", "desc": "1-2 sentence description"},
    {"name": "another sub-style", "desc": "1-2 sentence description"}
  ],
  "faqs": [
    {"q": "What are ${categoryName.toLowerCase()} games?", "a": "short 1-2 sentence answer"},
    {"q": "Are ${categoryName.toLowerCase()} games free to play?", "a": "short answer, mention no download needed"},
    {"q": "a relevant question a player might search for about this genre", "a": "short answer"}
  ]
}

Rules: Do NOT mention any specific game titles, character names, or company names anywhere in the response — describe genres and styles only in general terms. Keep tone friendly, safe for all ages. Never mention "unblocked" or bypassing filters/network restrictions. Output ONLY the JSON object.`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    let res;
    try {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });
    } catch (err) {
      console.log(`  ⚠ Network error, retrying in 10s... (${err.message})`);
      await sleep(10000);
      continue;
    }

    if (res.status === 429) {
      const body = await res.text();
      const match = body.match(/try again in (\d+\.?\d*)s/i);
      const waitSec = match ? Math.ceil(parseFloat(match[1])) + 2 : 15;
      console.log(`  ⏳ Rate limited, waiting ${waitSec}s (attempt ${attempt + 1}/${retries})...`);
      await sleep(waitSec * 1000);
      continue;
    }

    if (!res.ok) {
      throw new Error(`Groq error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("No content returned");

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON: " + text.slice(0, 200));
    }
  }

  throw new Error("Max retries exceeded due to rate limiting");
}

async function main() {
  if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY not found in .env.local");
    process.exit(1);
  }

  const dataDir = path.join(__dirname, "../data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  let existing = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    console.log(`Resuming — ${Object.keys(existing).length} categories already have some content.`);
  }

  let done = 0;
  let failed = [];

  for (const id of CATEGORIES) {
    // Already unna category ki faqs mariyu subgenres rendu unte matrame skip
    // చేస్తాం — intro/highlights matrame unna pాత entries ni ఇక్కడ
    // "incomplete" గా treat చేసి, వాటికి కొత్త fields add చేస్తాం.
    const hasFaqs = existing[id]?.faqs?.length > 0;
    const hasSubgenres = existing[id]?.subgenres?.length > 0;
    if (hasFaqs && hasSubgenres) continue;

    const name = formatName(id);
    try {
      const content = await generateContent(name);
      // Merge — pాత intro/highlights unte వాటినే కాపాడుకుంటాం,
      // faqs/subgenres matrame కొత్తగా వచ్చినవి వాడతాం.
      existing[id] = {
        intro: existing[id]?.intro || content.intro,
        highlights: existing[id]?.highlights || content.highlights,
        subgenres: content.subgenres || existing[id]?.subgenres || [],
        faqs: content.faqs || existing[id]?.faqs || [],
      };
      done++;
      console.log(`✓ [${done}] ${name}`);

      if (done % 5 === 0) {
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
      }
    } catch (err) {
      failed.push(name);
      console.error(`✗ ${name}: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
  console.log(`\n✅ Done! ${done} categories updated, ${failed.length} failed.`);
  if (failed.length) console.log("Failed:", failed);
}

main();