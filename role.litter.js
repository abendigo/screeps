let lib = require('lib');

var role = {
    preprocess: function(room) {
        let litter = room.find(FIND_DROPPED_ENERGY);
        console.log('litter', litter.length);
        if (litter.length)
            console.log('id', litter[0].id)

        lib.cleanupAssignments(room, 'litter', litter);            
    },

    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        var litter = creep.room.find(FIND_DROPPED_ENERGY);

	    if (creep.memory.state === 'deliver' && creep.carry.energy == 0) {
            creep.memory.state = 'sweep';
	    }
	    if (creep.memory.state !== 'deliver' && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.state = 'deliver';
	    }

        // Find dropped ENERGY and store it in EXTENSIONS or SPAWN
        if (creep.memory.state === 'deliver') {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                    }
                });
                if (tower && tower.energy < tower.energyCapacity) {
                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower);
                    }
                } else {
                    let storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: structure => structure.structureType === STRUCTURE_STORAGE
                    });
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }
        } else {
            let key = 'litter';
            if (!creep.memory.target && creep.room.memory[key]) {
                let target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                    filter: structure => {
                        return creep.room.memory[key][structure.id] === 'available';
                    }
                });

                if (target) {
                    creep.room.memory[key][target.id] = creep.name;
                    creep.memory.target = target.id;
                }
            }

            if (creep.memory.target) {
                let object = Game.getObjectById(creep.memory.target);
                console.log('====== object', object)
                if (object) {
                    if (creep.pickup(object) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(object);
                    }
                } else {
                    creep.memory.target = false;
                }
            } else if (creep.carry.energy > 0) {
                creep.memory.state = 'deliver';
            } else {
                lib.park(creep);
            }
        }
    }
};

module.exports = role;
