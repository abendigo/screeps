var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        options = options || {};
        options.source = options.source || 0;

	    if (creep.fatigue)
            return;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if (!creep.memory.upgrading) {
            var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureTypes == STRUCTURE_CONTAINER;
                }
            });

            console.log('container', containers.length);

            
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[options.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[options.source]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;