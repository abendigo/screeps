// Source of truth for the colony's current goal and sub-goals. Edited here
// (git history = goal history, commit messages = rationale for changes) and
// mirrored into Memory.goal each tick by main.ts so the dashboard can read
// it without its own copy. The live bot doesn't act on this directly - it
// can't reason at runtime (no network access) - this just records what a
// dev session decided to build toward and why, for humans and future
// sessions to see.
export const GOAL: GoalMemory = {
  summary: "Maximize the utility of the initial room (W51S4)",
  rationale:
    "Expanding to a second room needs a higher GCL than this account has yet, and there's a lot of real growth available in this one room first (extensions, towers, storage, etc.) - get the most out of it before expanding.",
  subGoals: [
    { id: "defense-basics", summary: "Defender role + safe-mode-on-loss", status: "done" },
    { id: "rcl2", summary: "Reach RCL2, unlock extensions", status: "done" },
    { id: "builder-containers", summary: "Builder role + planner: containers at sources", status: "done" },
    { id: "builder-roads", summary: "Planner-placed roads from spawn to sources/controller", status: "active" },
    { id: "rcl3-towers", summary: "Reach RCL3, add a tower for real defense", status: "pending" },
    { id: "hauler-role", summary: "Hauler role once containers exist, freeing harvesters from delivery", status: "pending" },
    { id: "storage-economy", summary: "Reach RCL4, build storage, stabilize the energy economy", status: "pending" },
  ],
};
