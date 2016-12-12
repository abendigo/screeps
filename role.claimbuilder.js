let lib = require('lib');

var role = {
    run: function(creep) {
        let targetRoom = 'W62S23';
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role} ${targetRoom} ticks: ${creep.ticksToLive}`)

        if (creep.fatigue || creep.spawning)
            return;

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }


        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(10, 10, targetRoom));
        } else {
            if (creep.memory.building) {
                // var targets = creep.room.find(FIND_STRUCTURES, {
                //         filter: (structure) => {
                //             return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                //                 structure.energy < structure.energyCapacity;
                //         }
                // });
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: structure => structure.structureType != STRUCTURE_ROAD &&
                                        structure.structureType != STRUCTURE_WALL
    			});
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            } else {
                // if (lib.refuel(creep);
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                let rc = creep.harvest(source); 
                if (rc === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                
            }
        }
    }
};

module.exports = role;
