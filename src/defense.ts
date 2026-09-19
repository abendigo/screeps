/**
 * Activates safe mode when the room's defender has died. A blunt last
 * resort - safe mode charges are limited and go on a long cooldown after
 * use - but losing the only defender means the room has no active
 * defense left until a replacement is spawned and reaches the fight.
 */
export function handleDefenderLoss(room: Room): void {
  const controller = room.controller;
  if (!controller) {
    return;
  }

  const result = controller.activateSafeMode();
  if (result === OK) {
    console.log(`${room.name}: defender lost - safe mode activated`);
  } else {
    console.log(`${room.name}: defender lost - safe mode activation failed (${result})`);
  }
}
