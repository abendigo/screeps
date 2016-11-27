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
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
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
            if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                if (creep.carry.energy > 0) {
                    creep.memory.building = true;
                    creep.say('building');
                } else {
                    lib.park(creep);
                }
            }
	    }
	}
};

module.exports = roleBuilder;