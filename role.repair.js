var roleRepair = {

	/** @param {Creep} creep **/
    run: function(creep, options) {
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
			var targets = creep.room.find(FIND_STRUCTURES, { 
			   filter: (structure) => { 
			       return ((structure.hits < 5000) && (structure.hits > 0))
			   }
			});
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
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