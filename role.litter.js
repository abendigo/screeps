let lib = require('lib');

var role = {
    preprocess: function(room) {
        let litter = room.find(FIND_DROPPED_ENERGY);
        console.log('litter', litter.length);
        if (litter.length)
            console.log('id', litter[0].id)

        lib.preprocessAssignments(room, 'litter', litter);            
/*
        if (!room.memory.litter) {
            room.memory.litter = {};
        }
        // for (let next in room.memory.sources) {
        //     let source = Game.getObjectById(next);
        //     if (!source) {
        //         console.log('removing old source')
        //         delete room.memory.sources[source];
        //     }
        // }
        // for (let next in sources) {
        //     console.log('in', next)
        // }
        for (let source of sources) {
            if (!room.memory.sources[source.id]) {
                room.memory.sources[source.id] = 'available';
            } else {
                if (room.memory.sources[source.id] !== 'available' && !Game.creeps[room.memory.sources[source.id]]) {
                    room.memory.sources[source.id] = 'available';
                }
            }
        }
*/        
    },

    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        var litter = creep.room.find(FIND_DROPPED_ENERGY);

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        // Find dropped ENERGY and store it in EXTENSIONS or SPAWN

        if (creep.memory.deliver) {
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
            if (litter.length) {
                // let target = litter[0];

                // for (let i = 1; i < litter.length; i++) {
                //     // console.log(target.amount, '<', litter[i].amount);
                //     if (target.amount < litter[i].amount) {
                //         target = litter[i];
                //     }
                // }
                let target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);

                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else if (creep.carry.energy > 0) {
                creep.memory.deliver = true;
                creep.say('deliver');
            } else {
                lib.park(creep);
                // creep.say('park');
                // let flag = creep.room.find(FIND_FLAGS, {
                //     filter: structure => {
                //         console.log(structure.name);
                //         return structure.name.startsWith('parking');
                //     }
                // });
                // console.log('flg', flag)
                // let rc = creep.moveTo(Game.flags.parking);
                // console.log('rc', rc)
            }
        }
    }
};

module.exports = role;
