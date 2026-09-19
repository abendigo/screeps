// Places construction sites the builder role can work. Runs occasionally,
// not every tick - there's nothing time-sensitive about placing a site, and
// re-scanning every tick would just waste CPU on room.find calls.
const PLAN_INTERVAL = 50;

function openSpotNear(pos: RoomPosition): RoomPosition | null {
  const terrain = new Room.Terrain(pos.roomName);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      const x = pos.x + dx;
      const y = pos.y + dy;
      if (x < 1 || x > 48 || y < 1 || y > 48) {
        continue;
      }
      if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
        continue;
      }
      return new RoomPosition(x, y, pos.roomName);
    }
  }
  return null;
}

function ensureContainer(source: Source): void {
  const hasOne =
    source.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s) => s.structureType === STRUCTURE_CONTAINER,
    }).length > 0 ||
    source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
      filter: (s) => s.structureType === STRUCTURE_CONTAINER,
    }).length > 0;

  if (hasOne) {
    return;
  }

  const spot = openSpotNear(source.pos);
  if (spot) {
    spot.createConstructionSite(STRUCTURE_CONTAINER);
  }
}

function findOpenSpots(center: RoomPosition, count: number): RoomPosition[] {
  const terrain = new Room.Terrain(center.roomName);
  const spots: RoomPosition[] = [];

  // Search outward in rings starting at radius 2, so extensions don't sit
  // on the tiles immediately around the spawn that creeps need to move
  // through.
  for (let radius = 2; radius <= 6 && spots.length < count; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) {
          continue;
        }
        const x = center.x + dx;
        const y = center.y + dy;
        if (x < 2 || x > 47 || y < 2 || y > 47) {
          continue;
        }
        if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
          continue;
        }
        const pos = new RoomPosition(x, y, center.roomName);
        if (pos.lookFor(LOOK_STRUCTURES).length > 0 || pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
          continue;
        }
        spots.push(pos);
        if (spots.length >= count) {
          return spots;
        }
      }
    }
  }
  return spots;
}

// Placing a site for a structure type the current RCL hasn't unlocked yet
// just fails harmlessly (Screeps rejects it), so it's safe to call this
// every pass regardless of level - once the controller reaches the RCL
// that unlocks more of a capped structure (extension, tower, ...), the
// next planning pass queues it automatically with no separate step needed.
function ensureCappedStructure(
  room: Room,
  spawn: StructureSpawn,
  structureType: BuildableStructureConstant,
  capsByLevel: { [level: number]: number },
): void {
  const controller = room.controller;
  if (!controller) {
    return;
  }

  const max = capsByLevel[controller.level] ?? 0;
  const existing = room.find(FIND_MY_STRUCTURES, {
    filter: (s) => s.structureType === structureType,
  }).length;
  const queued = room.find(FIND_CONSTRUCTION_SITES, {
    filter: (s) => s.structureType === structureType,
  }).length;

  const needed = max - existing - queued;
  if (needed <= 0) {
    return;
  }

  for (const spot of findOpenSpots(spawn.pos, needed)) {
    spot.createConstructionSite(structureType);
  }
}

// Caps how many road sites get placed in a single planning pass, so a
// freshly-explored room with several long unpaved routes doesn't dump a
// CPU-heavy burst of pathfinding + site creation into one tick. Anything
// left over just gets picked up on the next PLAN_INTERVAL pass.
const MAX_ROAD_SITES_PER_PASS = 10;

function hasRoadAt(pos: RoomPosition): boolean {
  return (
    pos.lookFor(LOOK_STRUCTURES).some((s) => s.structureType === STRUCTURE_ROAD) ||
    pos.lookFor(LOOK_CONSTRUCTION_SITES).some((s) => s.structureType === STRUCTURE_ROAD)
  );
}

function ensureRoad(from: RoomPosition, to: RoomPosition, budget: { remaining: number }): void {
  if (budget.remaining <= 0) {
    return;
  }

  const path = from.findPathTo(to, { ignoreCreeps: true, range: 1 });
  for (const step of path) {
    if (budget.remaining <= 0) {
      return;
    }
    const pos = new RoomPosition(step.x, step.y, from.roomName);
    if (!hasRoadAt(pos)) {
      if (pos.createConstructionSite(STRUCTURE_ROAD) === OK) {
        budget.remaining -= 1;
      }
    }
  }
}

export function run(room: Room): void {
  if (Game.time % PLAN_INTERVAL !== 0) {
    return;
  }

  const sources = room.find(FIND_SOURCES);
  for (const source of sources) {
    ensureContainer(source);
  }

  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn) {
    return;
  }

  ensureCappedStructure(room, spawn, STRUCTURE_EXTENSION, CONTROLLER_STRUCTURES.extension);
  ensureCappedStructure(room, spawn, STRUCTURE_TOWER, CONTROLLER_STRUCTURES.tower);

  const budget = { remaining: MAX_ROAD_SITES_PER_PASS };
  for (const source of sources) {
    ensureRoad(spawn.pos, source.pos, budget);
  }
  if (room.controller) {
    ensureRoad(spawn.pos, room.controller.pos, budget);
  }
}
