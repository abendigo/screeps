let lib = require('lib');

var role = {
    preprocess: function(room, context) {
        if (!room.memory.towers) {
            room.memory.towers = {};
        }
        // console.log(room.name, 'towers', towers.length);
        // console.log(room.name, 'memory.towers', JSON.stringify(room.memory.towers));

        for (let j in room.memory.towers) {
            let y = Game.getObjectById(j);
            if (!y) {
                delete room.memory.towers[j];
            }
        }

        for (let x of context.towers) {
            if (room.memory.towers[x.id]) {
                if (room.memory.towers[x.id] == 'available') {
                    // console.log('--- tower', x.id, 'available')
                } else {
                    if (Game.creeps[room.memory.towers[x.id]]) {
                        // console.log('--- tower', x.id,'assigned to', room.memory.containers[x.id], 'still alive')
                    } else {
                        // console.log('--- tower', x.id,'assigned to', room.memory.containers[x.id], 'dead')
                        room.memory.towers[x.id] = 'available';
                    }
                }
            } else {
                room.memory.towers[x.id] = 'available';
            }
        }


    },

    run: function(creep) {
        // console.log(`${creep.name} is ${creep.memory.role}: ${creep.memory.target} ${creep.memory.state} ${creep.carry.energy}`);

        if (creep.fatigue || creep.spawning)
            return;

        if (!creep.memory.target) {
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
                // creep.suicide();
            }
        }
        if (creep.memory.target) {
            let target = Game.getObjectById(creep.memory.target);

            if (target.energy < target.energyCapacity) {
                if (creep.memory.state === 'deliver' && creep.carry.energy === 0) {
                    creep.memory.state = 'refuel';
                }
                if (creep.memory.state !== 'deliver' && creep.carry.energy === creep.carryCapacity) {
                    creep.memory.state = 'deliver';
                }

                lib.createRoadsAndQueueRepairs(creep);

                if (creep.memory.state === 'deliver') {
                    if (creep.memory.target) {

                        let target = Game.getObjectById(creep.memory.target);
                        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }         
                } else {
                    lib.refuel(creep);
                    if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                        if (creep.carry.energy > 0) {
                            creep.memory.state = 'deliver';
                        } else {
                            lib.park(creep);
                        }
                    }
                }
            } else {
                lib.park(creep);
            }
        }
    }
};

module.exports = role;
