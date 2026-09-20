import * as builder from "roles/builder";
import * as defender from "roles/defender";
import * as defense from "defense";
import { GOAL } from "goal";
import * as harvester from "roles/harvester";
import * as hauler from "roles/hauler";
import * as miner from "roles/miner";
import * as planner from "planner";
import * as policy from "policy";
import * as spawner from "spawner";
import * as status from "status";
import * as tower from "tower";
import * as upgrader from "roles/upgrader";

// A creep still had significant ticksToLive the last time we saw it alive
// but is gone this tick - almost certainly lost to something other than
// old age (natural expiration counts down to ~0 first). 5 ticks of slack
// covers a creep that died the same tick its TTL would've hit 0 anyway.
const EXPIRED_TTL_THRESHOLD = 5;

function trackTtl(): void {
  for (const name in Game.creeps) {
    Memory.creeps[name].lastKnownTtl = Game.creeps[name].ticksToLive;
  }
}

function cleanupMemory(): { defenderLost: boolean } {
  let defenderLost = false;
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      const mem = Memory.creeps[name];
      const expired = (mem.lastKnownTtl ?? 0) <= EXPIRED_TTL_THRESHOLD;
      if (expired) {
        Memory.metrics.expiredThisWindow += 1;
        console.log(`${name} (${mem.role}): expired (natural lifespan)`);
      } else {
        Memory.metrics.deathsThisWindow += 1;
        console.log(`${name} (${mem.role}): lost unexpectedly (last known ttl ${mem.lastKnownTtl})`);
        if (mem.role === "defender") {
          defenderLost = true;
        }
      }
      delete Memory.creeps[name];
    }
  }
  return { defenderLost };
}

export function loop(): void {
  Memory.metrics ??= { deathsThisWindow: 0, expiredThisWindow: 0 };
  Memory.goal = GOAL;
  trackTtl();
  const { defenderLost } = cleanupMemory();

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      policy.tick(room);
      planner.run(room);
      spawner.run(room);
      status.update(room);
      tower.run(room);
      if (defenderLost) {
        defense.handleDefenderLoss(room);
      }
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        // Old role, being phased out in favor of miner/hauler - no longer
        // spawned (see spawner.ts), but existing ones keep running until
        // they age out naturally rather than being abandoned mid-lifespan.
        harvester.run(creep);
        break;
      case "miner":
        miner.run(creep);
        break;
      case "hauler":
        hauler.run(creep);
        break;
      case "defender":
        defender.run(creep);
        break;
      case "builder":
        builder.run(creep);
        break;
      case "upgrader":
        upgrader.run(creep);
        break;
      default:
        console.log(`${name}: unknown role "${creep.memory.role}"`);
    }
  }
}
