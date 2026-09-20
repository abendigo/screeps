/**
 * Upgrader: fetches energy from a source container (falling back to
 * harvesting directly if containers are empty) and continuously upgrades
 * the controller. Dedicated and single-purpose - hauler/builder's
 * structure-filling and build/repair priorities meant controller progress
 * was never guaranteed any energy of its own, only ever getting fed as a
 * last-resort fallback that a tight energy budget rarely reaches.
 */
export function run(creep: Creep): void {
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const controller = creep.room.controller;
    if (controller) {
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
    return;
  }

  const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
  });
  if (container) {
    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(container, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
    return;
  }

  const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (source) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}
