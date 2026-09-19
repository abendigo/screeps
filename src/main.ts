import * as builder from "roles/builder";
import * as defender from "roles/defender";
import * as defense from "defense";
import { GOAL } from "goal";
import * as harvester from "roles/harvester";
import * as planner from "planner";
import * as policy from "policy";
import * as spawner from "spawner";
import * as status from "status";

function cleanupMemory(): { defenderDied: boolean } {
  let defenderDied = false;
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      if (Memory.creeps[name].role === "defender") {
        defenderDied = true;
      }
      delete Memory.creeps[name];
      Memory.metrics.deathsThisWindow += 1;
    }
  }
  return { defenderDied };
}

export function loop(): void {
  Memory.metrics ??= { deathsThisWindow: 0 };
  Memory.goal = GOAL;
  const { defenderDied } = cleanupMemory();

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      policy.tick(room);
      planner.run(room);
      spawner.run(room);
      status.update(room);
      if (defenderDied) {
        defense.handleDefenderLoss(room);
      }
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        harvester.run(creep);
        break;
      case "defender":
        defender.run(creep);
        break;
      case "builder":
        builder.run(creep);
        break;
      default:
        console.log(`${name}: unknown role "${creep.memory.role}"`);
    }
  }
}
