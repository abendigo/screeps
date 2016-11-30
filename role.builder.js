let lib = require('lib');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        options = options || {};
        options.source = options.source || 1;

    	if (creep.fatigue || creep.spawning)
    		return;

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting: ' + options.source);
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

        if (creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
				filter: structure => structure.structureType != STRUCTURE_ROAD &&
						       		 structure.structureType != STRUCTURE_WALL
			});
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);

                }
            } else {
            	var targets = creep.room.find(FIND_STRUCTURES, {
				    filter: (structure) => {
				       return ((structure.hits < Math.min(structure.hitsMax, 5000)) && (structure.hits > 0))
				   }
				});

	            if(targets.length) {
	            	creep.say('repair');
	                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(targets[0]);
	                }
	            }
            }
	    }
	    else {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType === STRUCTURE_STORAGE)
                        console.log('type', structure.structureType, STRUCTURE_STORAGE, structure.store[RESOURCE_ENERGY])
                    return structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= 50;
                }
            });
            if (!container) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50
                    }
                });
            }
            if (!container && creep.room.energyAvailable > 700) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                               (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50);
                    }
                });
            }

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    rc = creep.moveTo(container);
                }
            } else {
                lib.park(creep);
            }
	    }
	}
};

module.exports = roleBuilder;