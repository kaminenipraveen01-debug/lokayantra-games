// scripts/generate-game-content.js
// Run locally: node scripts/generate-game-content.js
// .env.local లో GROQ_API_KEY ఉండాలి

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OUTPUT_PATH = path.join(__dirname, "../data/game-content.json");
const FEED_BASE = "https://feeds.gamepix.com/v2/json/?sid=A3ALT&pagination=96&page=";
const MAX_PAGES = 20; // 96 games/page x 20 = 1920 games max
const DELAY_MS = 2200; // Groq free tier ki generous, kani safety kosam chinna gap

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAllGames() {
  const games = [];
  let url = FEED_BASE + "1";
  let page = 1;
  while (url && page <= MAX_PAGES) {
    const res = await fetch(url);
    const data = await res.json();
    games.push(...(data.items || []));
    url = data.next_url && data.next_url !== url ? data.next_url : null;
    page++;
    console.log(`Fetched page ${page - 1}, total games so far: ${games.length}`);
  }
  return games;
}

async function generateContent(title, category, description, retries = 5) {
  const prompt = `You are writing helpful, factual content for a free browser games website.
Game Title: ${title}
Category: ${category}
Description: ${description || "(no description available)"}

Return ONLY valid JSON, no markdown, no code fences, no explanation text before or after, matching exactly this shape:
{
  "howToPlay": "2-3 sentence explanation of how the game is generally played",
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "faqs": [
    {"q": "Is [game title] free to play?", "a": "short answer"},
    {"q": "relevant question", "a": "short answer"},
    {"q": "another relevant question", "a": "short answer"}
  ],
  "controls": "short description of typical controls for this genre"
}

Rules: Do not invent plot/character details you can't know. Keep tone friendly, safe for all ages. Never mention "unblocked" or bypassing filters. Output ONLY the JSON object, nothing else.`;

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
      const match = body.match(/"retryDelay":\s*"?(\d+(\.\d+)?)/) || body.match(/try again in (\d+\.?\d*)s/i);
      const waitSec = match ? Math.ceil(parseFloat(match[1])) + 2 : 15;
      console.log(`  ⏳ Rate limited, waiting ${waitSec}s before retry (attempt ${attempt + 1}/${retries})...`);
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
      throw new Error("Groq returned invalid JSON: " + text.slice(0, 200));
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
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let existing = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    console.log(`Resuming — ${Object.keys(existing).length} games already have content.`);
  }

  console.log("Fetching GamePix game list...");
  const games = await fetchAllGames();
  console.log(`Total games found: ${games.length}`);

  let done = 0;
  let failed = [];

  for (const item of games) {
    const id = item.namespace || String(item.id);
    if (!id || !item.title) continue;
    if (existing[id]) continue;

    try {
      const content = await generateContent(item.title, item.category || "Arcade", item.description || "");
      existing[id] = content;
      done++;
      console.log(`✓ [${done}] ${item.title}`);

      if (done % 10 === 0) {
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
      }
    } catch (err) {
      failed.push(item.title);
      console.error(`✗ ${item.title}: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
  console.log(`\n✅ Done! ${done} games generated, ${failed.length} failed.`);
  if (failed.length) console.log("Failed:", failed.slice(0, 10));
}

main();