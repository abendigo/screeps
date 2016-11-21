var roleRepair = {

	/** @param {Creep} creep **/
    run: function(creep, options) {
		// console.log('roleRepair', creep.name, creep.memory.target);
		
        options = options || {};
        options.source = options.source || 1;

    	if (creep.fatigue)
    		return;

	    if(creep.memory.repair && creep.carry.energy == 0) {
            creep.memory.repair = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repair && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repair = true;
	        creep.say('repair');
	    }


	    if(creep.memory.repair) {
			if (creep.memory.target) {
				var target = Game.getObjectById(creep.memory.target);
				// console.log(creep.name, 'hits', target.hits, 'of', target.hitsMax)
				if (target == null) {
					// console.log('target not found')
					creep.memory.target = false;
				} else if (target.hits < Math.min(target.hitsMax, 5000)) {
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				} else {
					// console.log('already fixed')
					creep.memory.target = false;
				}
			} else {
				var targets = creep.room.find(FIND_STRUCTURES, { 
					filter: (structure) => { 
						return ((structure.hits < Math.min(target.hitsMax, 5000)) && (structure.hits > 0))
					}
				});
            	if (targets.length) {
					var index = Math.round(Math.random() * targets.length);
					// console.log('target', index)
					creep.memory.target = targets[index].id;
				}
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[options.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[options.source]);
            }
	    }
	}
};

module.exports = roleRepair;