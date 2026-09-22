// Obstacle-aware CostMatrix, shared by both moveToward() calls below -
// PathFinder.search doesn't know about real structures unless told, so
// without this it can (and did, live) treat impassable terrain as if it
// were open, producing paths that dead-end.
function obstacleCosts(roomName: string): CostMatrix | boolean {
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
    { plainCost: 2, swampCost: 10, maxOps: 20000, roomCallback: obstacleCosts },
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
