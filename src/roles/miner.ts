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

  if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s) => s.structureType === STRUCTURE_CONTAINER,
    })[0];
    creep.moveTo(container ?? source, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
}
