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

  const budget = { remaining: MAX_ROAD_SITES_PER_PASS };
  for (const source of sources) {
    ensureRoad(spawn.pos, source.pos, budget);
  }
  if (room.controller) {
    ensureRoad(spawn.pos, room.controller.pos, budget);
  }
}
