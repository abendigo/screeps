/**
 * Miner: parks permanently at its assigned source (see spawner.ts for
 * assignment) and just harvests every tick, forever. No CARRY part, so
 * overflow drops at its position - onto a container there if the planner's
 * already placed one (see planner.ts), onto bare ground otherwise until it
 * is. This replaces the old harvester's travel-then-deliver cycle for the
 * mining side of the job; roles/hauler.ts handles delivery.
 */
export function run(creep: Creep): void {
  const source = creep.memory.sourceId ? Game.getObjectById(creep.memory.sourceId) : null;
  if (!source) {
    return;
  }

  const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
    filter: (s) => s.structureType === STRUCTURE_CONTAINER,
  })[0];

  // Once positioned anywhere within harvest range of the source,
  // creep.harvest() succeeds and this never re-checks movement again - so
  // if that first in-range tile isn't the container's exact tile, overflow
  // drops on bare ground and decays there forever instead of ever reaching
  // the container. Explicitly re-target the container's tile every tick
  // until actually standing on it (harmless once there, since it's always
  // within harvest range too).
  // reusePath: 0 - this walk-to-post trip happens once per creep lifetime,
  // so it's worth fresh pathfinding every tick instead of the default
  // cached path, which can go stale and walk the creep straight into a
  // structure (e.g. an extension) that finished building after the path
  // was cached. maxOps raised well past the 2000 default - observed live,
  // recomputing from scratch every tick on complex terrain could settle
  // for a partial/local search result that wandered into a dead-end
  // pocket instead of fully solving the route.
  const moveOpts = { visualizePathStyle: { stroke: "#ffaa00" }, reusePath: 0, maxOps: 20000 };

  if (container && !creep.pos.isEqualTo(container.pos)) {
    creep.moveTo(container.pos, moveOpts);
    return;
  }

  if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    creep.moveTo(source, moveOpts);
  }
}
