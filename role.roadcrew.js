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
                } else if (target.hits < Math.min(target.hitsMax, 5000)) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.say('done');
                    creep.memory.target = false;
                }
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
        } else {
            lib.refuel(creep);
        }
    }
};

module.exports = role;
