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
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == 'container') {
                        console.log('energy', structure.store[RESOURCE_ENERGY]);
                    }
                    return structure.structureType == 'container' && structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            console.log(creep.name, 'container', container, 'energy', container.store[RESOURCE_ENERGY]);
            if (container.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            // } else {
            //     var sources = creep.room.find(FIND_SOURCES);
            //     if(creep.harvest(sources[options.source]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(sources[options.source]);
            //     }
            }
        }
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;