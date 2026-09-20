import { findRepairTarget } from "repair";

// Towers aren't creeps - no role/spawning involved, just per-tick structure
// actions. Attacks the first hostile creep in range if there is one,
// otherwise tops off the most-damaged non-wall/rampart structure (roads
// decay over time) so towers aren't sitting idle doing nothing.
export function run(room: Room): void {
  const towers = room.find(FIND_MY_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_TOWER,
  }) as StructureTower[];
  if (towers.length === 0) {
    return;
  }

  const hostile = room.find(FIND_HOSTILE_CREEPS)[0];
  if (hostile) {
    for (const tower of towers) {
      tower.attack(hostile);
    }
    return;
  }

  const repairTarget = findRepairTarget(room);
  if (repairTarget) {
    for (const tower of towers) {
      tower.repair(repairTarget);
    }
  }
}
