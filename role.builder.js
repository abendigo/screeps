var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
    	console.log('roleBuilder', options.source)
        options = options || {};
        options.source = options.source || 1;

    	if (creep.fatigue)
    		return;

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting: ' + options.source);
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	    	console.log('------ 1')
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
            	var targets = creep.room.find(FIND_STRUCTURES, { 
				    filter: (structure) => { 
				       return ((structure.hits < 5000) && (structure.hits > 0))
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
	    	console.log('------ 2')
	        var sources = creep.room.find(FIND_SOURCES);
	        console.log('source.length', sources.length)
            if(creep.harvest(sources[options.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[options.source]);
            }
	    }
	}
};

module.exports = roleBuilder;