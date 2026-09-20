import { findRepairTarget } from "repair";

// Roads are a travel-time nicety; extensions/containers are real capacity
// and throughput. Build anything non-road first, only touching roads once
// nothing higher-value is queued - otherwise a big batch of planned roads
// (see planner.ts) could delay an extension purely by being closer.
function pickSite(creep: Creep): ConstructionSite | null {
  const highPriority = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: (s) => s.structureType !== STRUCTURE_ROAD,
  });
  if (highPriority.length > 0) {
    return creep.pos.findClosestByPath(highPriority);
  }
  return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
}

/**
 * Builder: constructs whatever's queued (currently just source
 * containers, see planner.ts), falling back to repairing decayed
 * structures (no tower yet to do it - see repair.ts) and then to
 * upgrading the controller, so it's never idle.
 */
export function run(creep: Creep): void {
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const site = pickSite(creep);
    if (site) {
      if (creep.build(site) === ERR_NOT_IN_RANGE) {
        creep.moveTo(site, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return;
    }

    const repairTarget = findRepairTarget(creep.room);
    if (repairTarget) {
      if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
        creep.moveTo(repairTarget, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return;
    }

    const controller = creep.room.controller;
    if (controller) {
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  } else {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}
