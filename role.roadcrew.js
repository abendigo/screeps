let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name} `);

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
console.log(creep.name, 1)
                var target = Game.getObjectById(creep.memory.target);
                if (target == null) {
console.log(creep.name, 2)
                    creep.memory.target = false;
                } else {
console.log(creep.name, 3)
                    console.log('======', JSON.stringify(target))

                    if (target.progress !== undefined) {
console.log(creep.name, 4)
                        if (creep.build(target) == ERR_NOT_IN_RANGE) {
console.log(creep.name, 5)
                            creep.moveTo(target);
                        }
                    } else if (target.hits < target.hitsMax) {
console.log(creep.name, 6)
                        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
console.log(creep.name, 7)
                            creep.moveTo(target);
                        }
console.log(creep.name, 8)
                    } else {
console.log(creep.name, 9)
                        creep.memory.target = false;
                    }
                }
            } else {
                let xxx = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                    filter: structure => structure.structureType === STRUCTURE_ROAD
                });
                    console.log('xxx', creep.name, xxx)
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
                        creep.say('none');
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
