/**
 * Hauler: withdraws energy from source containers (see planner.ts/miner.ts)
 * and delivers it to spawn/extensions/towers, falling back to upgrading
 * the controller when nothing needs energy. This is the delivery half of
 * the old harvester role, now decoupled from mining.
 *
 * Delivery target picking weighs three things, not just distance:
 * - urgency: a structure well below its capacity matters more than a
 *   nearly-full one, so it's prioritized regardless of distance - an
 *   empty spawn blocks the whole colony from spawning anything.
 * - distance: once nothing is urgently low, deliver to whichever is
 *   actually closer - the controller if it's nearer than the nearest
 *   structure with room left, not the other way around by default.
 * - reservation: a target already claimed by enough other haulers'
 *   incoming energy to fill it is treated as already served, so a hauler
 *   doesn't walk toward a need someone else is about to meet - and
 *   redirects mid-trip if its own claimed target gets filled first.
 */
const URGENCY_THRESHOLD = 0.5;

type EnergySink = StructureSpawn | StructureExtension | StructureTower;
type DeliveryTarget = EnergySink | StructureController;

function reservedEnergy(target: EnergySink, exceptCreep: Creep): number {
  let reserved = 0;
  for (const name in Game.creeps) {
    const other = Game.creeps[name];
    if (other.id === exceptCreep.id || other.memory.role !== "hauler") {
      continue;
    }
    if (other.memory.deliverTargetId === target.id) {
      reserved += other.store.getUsedCapacity(RESOURCE_ENERGY);
    }
  }
  return reserved;
}

function effectiveFreeCapacity(target: EnergySink, exceptCreep: Creep): number {
  return Math.max(0, target.store.getFreeCapacity(RESOURCE_ENERGY) - reservedEnergy(target, exceptCreep));
}

function isEnergySink(s: AnyStructure): s is EnergySink {
  return s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER;
}

function currentTargetIfStillValid(creep: Creep): DeliveryTarget | null {
  const id = creep.memory.deliverTargetId;
  if (!id) {
    return null;
  }
  const target = Game.getObjectById(id);
  if (!target) {
    return null;
  }
  if (target.structureType === STRUCTURE_CONTROLLER) {
    return target;
  }
  return effectiveFreeCapacity(target, creep) > 0 ? target : null;
}

function pickDeliveryTarget(creep: Creep): DeliveryTarget | null {
  const existing = currentTargetIfStillValid(creep);
  if (existing) {
    return existing;
  }

  const needy = creep.room.find(FIND_STRUCTURES).filter(isEnergySink).filter((s) => effectiveFreeCapacity(s, creep) > 0);

  const urgent = needy.filter(
    (s) => s.store.getUsedCapacity(RESOURCE_ENERGY) / s.store.getCapacity(RESOURCE_ENERGY) < URGENCY_THRESHOLD,
  );
  if (urgent.length > 0) {
    return creep.pos.findClosestByPath(urgent);
  }

  const controller = creep.room.controller ?? null;
  const nearestNeedy = creep.pos.findClosestByPath(needy);

  if (!nearestNeedy) {
    return controller;
  }
  if (!controller) {
    return nearestNeedy;
  }

  const structureDist = creep.pos.findPathTo(nearestNeedy).length;
  const controllerDist = creep.pos.findPathTo(controller).length;
  return controllerDist < structureDist ? controller : nearestNeedy;
}

export function run(creep: Creep): void {
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
    creep.memory.deliverTargetId = undefined;
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const target = pickDeliveryTarget(creep);
    creep.memory.deliverTargetId = target ? target.id : undefined;

    if (target) {
      const result =
        target.structureType === STRUCTURE_CONTROLLER
          ? creep.upgradeController(target)
          : creep.transfer(target, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  } else {
    const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
    });
    if (container) {
      if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}
