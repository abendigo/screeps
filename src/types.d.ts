// Augment the base Screeps types with our own memory shape.
// See: https://github.com/screeps/screeps/wiki/Typescript-support

declare global {
  interface CreepMemory {
    role: string;
    working: boolean;
  }

  interface Memory {
    uuid: number;
    log: unknown;
  }
}

export {};
