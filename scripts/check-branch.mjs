#!/usr/bin/env node
// Read-only diagnostic: lists Screeps code branches and, for the target
// branch, each module's name and content length. Useful when a deploy
// "succeeded" but the code editor doesn't show what's expected.
import { ScreepsHttpClient } from "screeps-api";

const token = process.env.SCREEPS_TOKEN;
if (!token) {
  console.error("Missing SCREEPS_TOKEN.");
  process.exit(1);
}

const branch = process.env.SCREEPS_BRANCH || "default";

const api = new ScreepsHttpClient({
  token,
  protocol: "https",
  hostname: "screeps.com",
  port: 443,
  path: "/",
});

try {
  const { list } = await api.userBranches();
  console.log("Branches:", JSON.stringify(list, null, 2));

  const target = list.find((b) => b.branch === branch);
  if (!target) {
    console.log(`Branch "${branch}" does not exist.`);
    process.exit(0);
  }

  const code = await api.userCodeGet(branch);
  const modules = code.modules || {};
  const names = Object.keys(modules);
  console.log(`Modules on branch "${branch}" (${names.length}):`);
  for (const [name, content] of Object.entries(modules)) {
    const length = typeof content === "string" ? content.length : JSON.stringify(content).length;
    console.log(`  "${name}": ${length} chars`);
  }
} catch (err) {
  console.error("Check failed:", err.response?.data ?? err.message);
  process.exit(1);
}
