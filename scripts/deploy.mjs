#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ScreepsHttpClient } from "screeps-api";

const token = process.env.SCREEPS_TOKEN;
if (!token) {
  console.error(
    "Missing SCREEPS_TOKEN. Generate one at https://screeps.com/a/#!/account/auth-tokens " +
      "and set it as a SCREEPS_TOKEN env var (or repo secret in CI) before running `npm run deploy`.",
  );
  process.exit(1);
}

const branch = process.env.SCREEPS_BRANCH || "default";
const mainPath = fileURLToPath(new URL("../dist/main.js", import.meta.url));
const main = readFileSync(mainPath, "utf8");

const api = new ScreepsHttpClient({
  token,
  protocol: "https",
  hostname: "screeps.com",
  port: 443,
  path: "/",
});

try {
  const { list } = await api.userBranches();
  const exists = list.some((b) => b.branch === branch);

  if (exists) {
    await api.userCodeSet({ branch, modules: { main } });
  } else {
    await api.userCloneBranch("", branch, { main });
  }

  console.log(`Deployed dist/main.js to Screeps branch "${branch}"`);
} catch (err) {
  const detail = err.response?.data ?? err.message;
  console.error(`Deploy failed: ${JSON.stringify(detail)}`);
  process.exit(1);
}
