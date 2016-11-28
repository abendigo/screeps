let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name} is ${creep.memory.role}: ${creep.carry.energy}`);
        if (creep.fatigue || creep.spawning)
            return;

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	    }

        lib.createRoadsAndQueueRepairs(creep);

        if (creep.memory.deliver) {
console.log('dliver')            
            if (!creep.memory.target) {
console.log('no target')                
                let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            creep.room.memory.towers[structure.id] == 'available';
                    }
                });

                if (tower) {
                    creep.room.memory.towers[tower.id] = creep.name;
                    creep.memory.target = tower.id;
                } else {
                    console.log(creep.name, 'HELP NO EMPTY CONTIANERS');
                    creep.suicide();
                }
            }
            if (creep.memory.target) {
                let target = Game.getObjectById(creep.memory.container);
console.log('target', target)                
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }         
        } else {
            lib.refuel(creep);
        }
    }
};

module.exports = role;
