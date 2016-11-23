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
            var storage = Game.getObjectById('5834d53ba28559d70a076e2c');

            // var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return structure.structureType == 'container' && structure.store[RESOURCE_ENERGY] > 0;
            //     }
            // });

            // console.log(creep.name, 'container', container, 'energy', container.store[RESOURCE_ENERGY]);
            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
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