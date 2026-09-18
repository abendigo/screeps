import "dotenv/config";
import express from "express";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOKEN = process.env.SCREEPS_TOKEN;
const SHARD = process.env.SCREEPS_SHARD ?? "shard1";
const API_BASE = process.env.SCREEPS_API_BASE ?? "https://screeps.com/api";
const PORT = process.env.PORT ?? 3141;
const GIT_SHA = process.env.GIT_SHA ?? "unknown";
const GIT_DATE = process.env.GIT_DATE ?? null;
const STARTED_AT = Date.now();

if (!TOKEN) {
  console.error(
    "Missing SCREEPS_TOKEN. Generate one at https://screeps.com/a/#!/account/auth-tokens, " +
      "then set it in tools/dashboard/.env (see .env.example).",
  );
  process.exit(1);
}

// Screeps sometimes returns memory values gzip+base64 encoded, flagged with a
// "gz:" prefix, once above a size threshold. Handle both that and plain JSON.
function decodeMemoryValue(data) {
  if (data === null || data === undefined) {
    return null;
  }
  if (typeof data !== "string") {
    return data;
  }
  if (data.startsWith("gz:")) {
    const buf = Buffer.from(data.slice(3), "base64");
    return JSON.parse(gunzipSync(buf).toString("utf8"));
  }
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

async function fetchMemory() {
  // Fetch the whole Memory object in one request rather than one request per
  // top-level key - Screeps' per-token rate limit is easy to blow through
  // otherwise (see git history: 3 requests every 4s hit a ~23h lockout).
  const url = `${API_BASE}/user/memory?shard=${SHARD}`;
  const res = await fetch(url, { headers: { "X-Token": TOKEN } });
  const text = await res.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response for Memory (HTTP ${res.status}): ${text.slice(0, 300)}`);
  }
  if (!body.ok) {
    throw new Error(`Screeps API rejected request for Memory: ${text.slice(0, 300)}`);
  }
  return decodeMemoryValue(body.data) ?? {};
}

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// A small server-side cache so multiple open tabs (or a low client poll
// interval) can't multiply requests against Screeps' rate limit - everyone
// polling within CACHE_TTL_MS shares one upstream fetch.
const CACHE_TTL_MS = 15_000;
let cached = null;
let cachedAt = 0;

app.get("/api/state", async (_req, res) => {
  try {
    if (!cached || Date.now() - cachedAt > CACHE_TTL_MS) {
      const memory = await fetchMemory();
      cached = { ok: true, policy: memory.policy ?? null, metrics: memory.metrics ?? null, status: memory.status ?? null };
      cachedAt = Date.now();
    }
    res.json({
      ...cached,
      fetchedAt: cachedAt,
      version: { gitSha: GIT_SHA, gitDate: GIT_DATE, uptimeSeconds: Math.floor((Date.now() - STARTED_AT) / 1000) },
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ ok: false, error: String(err.message ?? err) });
  }
});

app.listen(PORT, () => {
  console.log(`Screeps dashboard running at http://localhost:${PORT} (shard: ${SHARD})`);
});
