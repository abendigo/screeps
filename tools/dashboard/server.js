import "dotenv/config";
import express from "express";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOKEN = process.env.SCREEPS_TOKEN;
const SHARD = process.env.SCREEPS_SHARD ?? "shard3";
const API_BASE = process.env.SCREEPS_API_BASE ?? "https://screeps.com/api";
const PORT = process.env.PORT ?? 3141;

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

async function fetchMemoryPath(memoryPath) {
  const url = `${API_BASE}/user/memory?path=${encodeURIComponent(memoryPath)}&shard=${SHARD}`;
  const res = await fetch(url, { headers: { "X-Token": TOKEN } });
  const text = await res.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response for Memory.${memoryPath} (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }
  if (!body.ok) {
    throw new Error(`Screeps API rejected request for Memory.${memoryPath}: ${text.slice(0, 200)}`);
  }
  return decodeMemoryValue(body.data);
}

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/state", async (_req, res) => {
  try {
    const [policyMem, metrics, status] = await Promise.all([
      fetchMemoryPath("policy"),
      fetchMemoryPath("metrics"),
      fetchMemoryPath("status"),
    ]);
    res.json({ ok: true, policy: policyMem, metrics, status, fetchedAt: Date.now() });
  } catch (err) {
    console.error(err);
    res.status(502).json({ ok: false, error: String(err.message ?? err) });
  }
});

app.listen(PORT, () => {
  console.log(`Screeps dashboard running at http://localhost:${PORT} (shard: ${SHARD})`);
});
