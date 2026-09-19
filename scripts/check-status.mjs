#!/usr/bin/env node
// Read-only diagnostic: fetches Memory.policy/metrics/status for the colony
// and prints them. Mirrors tools/dashboard/server.js's single whole-Memory
// fetch (don't add per-path requests - see that file's rate-limit note).
import { gunzipSync } from "node:zlib";

const token = process.env.SCREEPS_TOKEN;
if (!token) {
  console.error("Missing SCREEPS_TOKEN.");
  process.exit(1);
}

const shard = process.env.SCREEPS_SHARD || "shard1";
const apiBase = process.env.SCREEPS_API_BASE || "https://screeps.com/api";

function decodeMemoryValue(data) {
  if (data === null || data === undefined) return null;
  if (typeof data !== "string") return data;
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

const url = `${apiBase}/user/memory?shard=${shard}`;
const res = await fetch(url, { headers: { "X-Token": token } });
const text = await res.text();

let body;
try {
  body = JSON.parse(text);
} catch {
  console.error(`Non-JSON response (HTTP ${res.status}): ${text.slice(0, 300)}`);
  process.exit(1);
}
if (!body.ok) {
  console.error(`Screeps API rejected request: ${text.slice(0, 300)}`);
  process.exit(1);
}

const memory = decodeMemoryValue(body.data) ?? {};
console.log("=== Memory.status ===");
console.log(JSON.stringify(memory.status ?? null, null, 2));
console.log("=== Memory.policy ===");
console.log(JSON.stringify(memory.policy ?? null, null, 2));
console.log("=== Memory.metrics ===");
console.log(JSON.stringify(memory.metrics ?? null, null, 2));
