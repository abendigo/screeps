var role = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.fatigue)
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
                               structure.hits < 5000 &&
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
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == 'container' && structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            console.log('roadcrew', creep.name, 'container', container, 'energy', container.store[RESOURCE_ENERGY]);
            if (container.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
    }
};

module.exports = role;