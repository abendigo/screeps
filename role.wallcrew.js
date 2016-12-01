let lib = require('lib');

var role = {
    /** @param {Creep} creep **/
    run: function(creep) {
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
                    creep.say('$%#@')
                    creep.memory.target = false;
                } else if (target.hits < creep.memory.targetHits) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.say('done');
                    creep.memory.target = false;
                }
            } else {
                let site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_WALL;
                    }
                });

                if (site) {
                    if(creep.build(site) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(site);
                    }
                } else {

                let targetHits = 5000;
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_WALL &&
                               structure.hits < Math.min(structure.hitsMax, 5000) &&
                               structure.hits > 0;
                    }
                });
                if (!target) {
                    targetHits = 15000;
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_WALL &&
                                   structure.hits < Math.min(structure.hitsMax, 15000) &&
                                   structure.hits > 0;
                        }
                    });
                }
                if (!target) {
                    targetHits = 45000;
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_WALL &&
                                   structure.hits < Math.min(structure.hitsMax, 45000) &&
                                   structure.hits > 0;
                        }
                    });
                }
                if (!target) {
                    targetHits = 135000;
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_WALL &&
                                   structure.hits < Math.min(structure.hitsMax, 135000) &&
                                   structure.hits > 0;
                        }
                    });
                }

                if (target) {
                    creep.say(target.id);
                    creep.memory.target = target.id;
                    creep.memory.targetHits = targetHits;
                } else {
                    creep.say('none');
                }
            }
            }
        } else {
            if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                if (creep.carry.energy > 0) {
                    creep.memory.repair = true;
                } else {
                    lib.park(creep);
                }
            }
        }
    }
};

module.exports = role;
