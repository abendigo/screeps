let lib = require('lib');

var role = {
    run: function(creep) {
        console.log('claimbuilder', creep.name, creep.room.name, creep.memory.building)
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

        if (creep.room.name === 'W63S24') {  // Home
            if (creep.memory.building) {
                let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
                creep.moveTo(exit);
            } else {
                lib.refuel(creep);
            }
        } else if (creep.room.name === 'W63S23') {  // Target
            if (creep.memory.building) {
                let claim = Game.getObjectById('57ef9ccb86f108ae6e60cd6c')
                if (claim) {
                    if (creep.build(claim) == ERR_NOT_IN_RANGE)
                        creep.moveTo(claim);
                }
            } else {
                let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        } else {
            console.log('WHERE AM I?')
            creep.suicide();
        }
    }
};

module.exports = role;
