let lib = require('lib');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        options = options || {};
        options.source = options.source || 1;

        if (creep.fatigue || creep.spawning)
            return;

        if(creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('harvesting');
        }
        if(!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
            creep.memory.deliver = true;
            creep.say('delivering');
        }

        if (creep.memory.deliver) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[options.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[options.source]);
            }
        }
	}
};

module.exports = roleHarvester;

