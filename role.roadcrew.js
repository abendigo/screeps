let lib = require('lib');

var role = {
    run: function(creep) {
        // console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name} `);

        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.repair && creep.carry.energy == 0) {
            creep.memory.repair = false;
            creep.say('harvesting');
        }
        if (!creep.memory.repair && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repair = true;
            creep.say('repair');
        }

        if (creep.memory.repair) {
            if (creep.memory.target) {
                var target = Game.getObjectById(creep.memory.target);
                if (target == null) {
                    creep.memory.target = false;
                } else {
                    if (target.progress !== undefined) {
                        if (creep.build(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    } else if (target.hits < target.hitsMax) {
                        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    } else {
                        creep.memory.target = false;
                    }
                }
            } else {
                let xxx = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                    filter: structure => structure.structureType === STRUCTURE_ROAD
                });
                if (xxx) {
                    creep.memory.target = xxx.id;
                } else {
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_ROAD &&
                                structure.hits < structure.hitsMax &&
                                structure.hits > 0;
                        }
                    });

                    if (target) {
                        creep.say(target.id);
                        creep.memory.target = target.id;
                    } else {
                        lib.park(creep);
                    }
                }
            }
        } else {
            if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                if (creep.carry.energy > 0) {
                    creep.memory.repair = true;
                    creep.say('repair');
                } else {
                    lib.park(creep);
                }
            }
        }
    }
};

module.exports = role;
