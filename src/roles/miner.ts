// Creeps get a high but non-maximum cost, not full impassability
// (0xff) like structures/terrain - this room has at least one narrow,
// single-tile-wide corridor, and marking a transient occupant there as a
// hard wall made PathFinder report the route incomplete instead of just
// more expensive, producing a useless partial path back into a dead end.
// Structures/terrain are genuinely permanent, so those stay 0xff; a creep
// usually isn't and will move on its own, so a strong-but-finite cost
// still lets the search route through as a last resort instead of failing
// outright.
const CREEP_COST = 20;

// Obstacle-aware CostMatrix, shared by both moveToward() calls below -
// PathFinder.search doesn't know about real structures or other creeps
// unless told. Without the structure check it can (and did, live) treat
// impassable terrain as if it were open, producing paths that dead-end.
// Without the creep check, it can (and did, live - a parked defender)
// keep recomputing the exact same route through a tile another creep is
// standing on every tick, silently failing to move since nothing here
// ever considered that tile blocked.
function obstacleCosts(roomName: string, selfId: Id<Creep>): CostMatrix | boolean {
  const room = Game.rooms[roomName];
  if (!room) {
    return false;
  }
  const costs = new PathFinder.CostMatrix();
  room.find(FIND_STRUCTURES).forEach((s) => {
    if ((OBSTACLE_OBJECT_TYPES as readonly string[]).includes(s.structureType)) {
      costs.set(s.pos.x, s.pos.y, 0xff);
    }
  });
  room.find(FIND_CREEPS).forEach((c) => {
    if (c.id !== selfId) {
      costs.set(c.pos.x, c.pos.y, CREEP_COST);
    }
  });
  return costs;
}

// This walk-to-post trip happens once per creep lifetime, so it's worth
// computing a fresh, fully obstacle-aware path every tick and following it
// directly via moveByPath - moveTo's own built-in pathfinding was observed
// live repeatedly wandering into a genuine dead-end pocket in this room's
// terrain (confirmed via a direct PathFinder.search from the same
// position finding a complete, cheap 56-step route), so rather than trust
// whatever's different about its internal search, compute and follow the
// path ourselves.
function moveToward(creep: Creep, pos: RoomPosition): void {
  const result = PathFinder.search(
    creep.pos,
    { pos, range: 1 },
    {
      plainCost: 2,
      swampCost: 10,
      maxOps: 20000,
      roomCallback: (roomName) => obstacleCosts(roomName, creep.id),
    },
  );
  creep.moveByPath(result.path);
}

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
  if (container && !creep.pos.isEqualTo(container.pos)) {
    moveToward(creep, container.pos);
    return;
  }

  if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    moveToward(creep, source.pos);
  }
}
