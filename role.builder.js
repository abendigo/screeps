let lib = require('lib');

let role = {
	preprocess: function(room, context) {
		// console.log('builder preprocess', room.name)
	},

    run: function(creep, context) {
    	if (creep.fatigue || creep.spawning)
    		return;
    		
		// console.log(`${creep.name}[${creep.memory.role}] ${creep.memory.state}`)
			let role = creep.memory.role;
			let currentCount = context.creeps[role].length;
			// console.log(`xount ${currentCount} of ${context.desiredCreeps[role]}`)

	    if (creep.memory.state === 'building' && creep.carry.energy === 0) {
			if (creep.memory.suicide) {
				creep.suicide();
			} else {
            	creep.memory.state = 'fueling';
			}
	    }
	    if (creep.memory.state !== 'building' && creep.carry.energy === creep.carryCapacity) {
	        creep.memory.state = 'building';
	    }

        if (creep.memory.state === 'building') {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
				filter: structure => structure.structureType != STRUCTURE_ROAD &&
						       		 structure.structureType != STRUCTURE_WALL
			});
            if (targets.length) {
				let rc = creep.build(targets[0]);
                if (rc == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);

                }
            } else {
            	var targets = creep.room.find(FIND_STRUCTURES, {
				    filter: (structure) => {
				       return ((structure.hits < Math.min(structure.hitsMax, 5000)) && (structure.hits > 0))
				   }
				});

	            if (targets.length) {
	            	creep.say('repair');
	                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(targets[0]);
	                }
	            } else {
					// creep.memory.role = 'upgrader'
				}
            }
	    }
	    else {
            if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                if (creep.carry.energy > 0) {
                    creep.memory.state = 'building';
                } else {
                    lib.park(creep);
                }
            }
	    }
	}
};

module.exports = role;
