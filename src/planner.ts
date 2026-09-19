// Places construction sites the builder role can work. Runs occasionally,
// not every tick - there's nothing time-sensitive about placing a site, and
// re-scanning every tick would just waste CPU on room.find calls.
const PLAN_INTERVAL = 50;

// Checking only walls/bounds and returning the first match let this keep
// "finding" a tile that's actually already claimed by something else (e.g.
// a road construction site) - it would retry the same occupied tile every
// planning pass and silently fail forever, since createConstructionSite
// rejects a second site on an already-occupied tile. Skip occupied tiles
// like findOpenSpots does.
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
      const candidate = new RoomPosition(x, y, pos.roomName);
      if (isOccupied(candidate)) {
        continue;
      }
      return candidate;
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

// Would blocking `spot` cut the spawn off from any of `criticalPositions`
// (the sources and controller - the places creeps actually need to reach)?
// findOpenSpots only avoids walls and existing occupants on its own; a ring
// of otherwise-legal spots can still wall off part of the room between
// them and natural terrain, so this is a separate, explicit check rather
// than something the ring search would catch by construction.
function blocksConnectivity(spot: RoomPosition, spawn: StructureSpawn, criticalPositions: RoomPosition[]): boolean {
  for (const target of criticalPositions) {
    const result = PathFinder.search(
      spawn.pos,
      { pos: target, range: 1 },
      {
        plainCost: 2,
        swampCost: 10,
        roomCallback: (roomName) => {
          if (roomName !== spawn.room.name) {
            return false;
          }
          const costs = new PathFinder.CostMatrix();
          costs.set(spot.x, spot.y, 0xff);
          return costs;
        },
      },
    );
    if (result.incomplete) {
      return true;
    }
  }
  return false;
}

function findOpenSpots(
  spawn: StructureSpawn,
  count: number,
  criticalPositions: RoomPosition[],
): RoomPosition[] {
  const center = spawn.pos;
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
        if (blocksConnectivity(pos, spawn, criticalPositions)) {
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
  criticalPositions: RoomPosition[],
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

  for (const spot of findOpenSpots(spawn, needed, criticalPositions)) {
    spot.createConstructionSite(structureType);
  }
}

// Caps how many road sites get placed in a single planning pass, so a
// freshly-explored room with several long unpaved routes doesn't dump a
// CPU-heavy burst of pathfinding + site creation into one tick. Anything
// left over just gets picked up on the next PLAN_INTERVAL pass.
const MAX_ROAD_SITES_PER_PASS = 10;

// Checking only "is there already a road here" let a planned road silently
// overwrite a different pending site (observed live: a road path happened
// to land exactly on a source's only viable container spot and replaced
// its construction site outright, with no error - Screeps allows one
// construction site per tile and just swaps it). Roads should route around
// anything already claimed, not through it.
function isOccupied(pos: RoomPosition): boolean {
  return pos.lookFor(LOOK_STRUCTURES).length > 0 || pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0;
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
    if (!isOccupied(pos)) {
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

  const criticalPositions = [...sources.map((s) => s.pos), ...(room.controller ? [room.controller.pos] : [])];
  ensureCappedStructure(room, spawn, STRUCTURE_EXTENSION, CONTROLLER_STRUCTURES.extension, criticalPositions);
  ensureCappedStructure(room, spawn, STRUCTURE_TOWER, CONTROLLER_STRUCTURES.tower, criticalPositions);

  const budget = { remaining: MAX_ROAD_SITES_PER_PASS };
  for (const source of sources) {
    ensureRoad(spawn.pos, source.pos, budget);
  }
  if (room.controller) {
    ensureRoad(spawn.pos, room.controller.pos, budget);
  }
}
