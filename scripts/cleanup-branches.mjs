#!/usr/bin/env node
// One-off maintenance: activate KEEP_BRANCH as the live world branch, then
// delete every other code branch on the account. Destructive; run by hand
// via workflow_dispatch, not on any automatic trigger.
import { ScreepsHttpClient } from "screeps-api";

const token = process.env.SCREEPS_TOKEN;
if (!token) {
  console.error("Missing SCREEPS_TOKEN.");
  process.exit(1);
}

const keep = process.env.KEEP_BRANCH || "default";

const api = new ScreepsHttpClient({
  token,
  protocol: "https",
  hostname: "screeps.com",
  port: 443,
  path: "/",
});

try {
  const { list } = await api.userBranches();
  console.log(
    "Current branches:",
    list.map((b) => `${b.branch}${b.activeWorld ? " (activeWorld)" : ""}${b.activeSim ? " (activeSim)" : ""}`),
  );

  if (!list.some((b) => b.branch === keep)) {
    console.error(`Branch "${keep}" does not exist - aborting.`);
    process.exit(1);
  }

  console.log(`Activating "${keep}" as the world branch...`);
  await api.userSetActiveBranch(keep, "activeWorld");

  const toDelete = list.map((b) => b.branch).filter((b) => b !== keep);
  console.log(`Deleting ${toDelete.length} branch(es): ${toDelete.join(", ")}`);

  for (const branch of toDelete) {
    try {
      await api.userDeleteBranch(branch);
      console.log(`  deleted "${branch}"`);
    } catch (err) {
      console.error(`  failed to delete "${branch}": ${JSON.stringify(err.response?.data ?? err.message)}`);
    }
  }

  console.log("Done.");
} catch (err) {
  console.error("Cleanup failed:", err.response?.data ?? err.message);
  process.exit(1);
}
