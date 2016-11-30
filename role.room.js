//let lib = require('lib');
var roleTower = require('role.tower');

var role = {
    run: function(room, roles) {
        console.log(`Room "${room.name}" has ${room.energyAvailable} energy of ${room.energyCapacityAvailable}`);

        // let roads = room.find(FIND_CONSTRUCTION_SITES, {
        //     filter: structure => structure.structureType == STRUCTURE_ROAD
        // });
        // console.log('roads', roads.length);
        // if (roads.length)
        //     console.log('rc', roads[0].remove());
        // for (road of roads) {
        //     road.remove();
        // }

        let creeps = {};
        let output = `${room.name}: `;
        for (var role in roles) {
            creeps[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room.name == room.name);
            output += `${role}: ${creeps[role].length} `;
        }
        console.log(output);

        let containers;
        let spawn;

        let context = {};
        function prepareContext() {
            context.sources = room.find(FIND_SOURCES);
        }
        prepareContext();

        roles.h3.preprocess(room, context);
        roles.litter.preprocess(room, context);

        let sources = context.sources;
        if (room.energyCapacityAvailable >= 300) {

            let spawns = room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_SPAWN
            });
            spawn = spawns[0];
            // console.log('spawn', spawn)



            containers = room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER
            });

            if (!room.memory.containers) {
                room.memory.containers = {};
            }
            // console.log(room.name, 'containers', containers.length, creeps.h2.length);
            // console.log(room.name, 'memory.containers', JSON.stringify(room.memory.containers));

            for (let j in room.memory.containers) {
                let y = Game.getObjectById(j);
                if (!y) {
                    delete room.memory.containers[j];
                }
            }

            for (let x of containers) {
                if (room.memory.containers[x.id]) {
                    if (room.memory.containers[x.id] == 'available') {
                        // console.log('--- container', x.id, 'available')
                    } else {
                        if (Game.creeps[room.memory.containers[x.id]]) {
                            // console.log('--- container', x.id,'assigned to', room.memory.containers[x.id], 'still alive')
                        } else {
                            // console.log('--- container', x.id,'assigned to', room.memory.containers[x.id], 'dead')
                            room.memory.containers[x.id] = 'available';
                        }
                    }
                } else {
                    room.memory.containers[x.id] = 'available';
                }
            }
        }

        let towers = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_TOWER
        });

        if (room.name === 'W63S23') {
console.log('here i am')            
            // if (creeps['h2'].length < 1) {
            //     if (room.energyAvailable >= 300) {
            //         spawn.createCreep([WORK,WORK,MOVE,MOVE], undefined, {role: 'h2'});
            //     }
            if (sources.length > creeps.h3.length) {
                if (room.energyAvailable > 550)
                    spawn.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: 'h3'});
            // } else if (creeps['harvester'].length < 1) {
            //     if (room.energyAvailable >= 300) {
            //         spawn.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            //     }
            } else if (creeps['transport'].length < 1) {
                if (room.energyAvailable > 700) {
                    spawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'transport'});
                }
            } else if (creeps['litter'].length < 2) {
                if (room.energyAvailable > 700) {
                    spawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'litter'});
                }
            } else if (creeps['builder'].length < 2) {
                if (room.energyAvailable >= 500) {
                    spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
                }
            } else if (creeps.towertransport.length < towers.length) {
                if (room.energyAvailable > 350) {
                    spawn.createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'towertransport'});
                }
            } else if (creeps['roadcrew'].length < 2) {
console.log('======== build roadcrew')
                if (room.energyAvailable >= 500) {
                    spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'roadcrew'});
                }
            } else if (creeps['builder'].length < 1) {
console.log('======== build builder')
                if (room.energyAvailable >= 500) {
                    spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
                }
            } else if (creeps['upgrader'].length < 2) {
console.log('======== build upgrader')
                if (room.energyAvailable >= 550) {
                    spawn.createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
                }
//             } else if (room.energyAvailable >= 1000) {
//                 spawn.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
            // } else if (creeps['harvester'].length < 1) {
            //     if (energyAvailable >= 550) {
            //         Game.spawns[home].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
            //     }
            // } else if (creeps['sweeper'].length < 1) {
            //     if (room.energyAvailable > 350) {
            //         spawn.createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'sweeper'});
            //     }
            // } else if (creeps['repair'].length < 1) {
            //     if (room.energyAvailable >= 500) {
            //         spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repair'});
            //     }
            // } else if (creeps['wallcrew'].length < 1) {
            //     if (room.energyAvailable >= 500) {
            //         spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'wallcrew'});
            //     }
            // } else if (creeps.scout && creeps['scout'].length < 1) {
            //     if (room.energyAvailable >= 330) {
            //         spawn.createCreep([ATTACK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'scout'});
            //     }
            }

        } else if (room.name === 'W63S24') {
            // if (creeps['h2'].length < 1) {
            //     if (room.energyAvailable >= 300) {
            //         spawn.createCreep([WORK,WORK,MOVE,MOVE], undefined, {role: 'h2'});
            //     }
            if (sources.length > creeps.h3.length) {
                if (room.energyAvailable > 550)
                    spawn.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: 'h3'});
            } else if (creeps['harvester'].length < 1) {
                if (room.energyAvailable >= 300) {
                    spawn.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
                }
            } else if (creeps['litter'].length < 2) {
                if (room.energyAvailable > 700) {
                    spawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'litter'});
                }
            } else if (creeps['transport'].length < 1) {
                if (room.energyAvailable > 350) {
                    spawn.createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'transport'});
                }
            } else if (creeps.towertransport.length < towers.length) {
                if (room.energyAvailable > 350) {
                    spawn.createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'towertransport'});
                }
            } else if (creeps['sweeper'].length < 2) {
                if (room.energyAvailable > 350) {
                    spawn.createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'sweeper'});
                }
            } else if (creeps['builder'].length < 3) {
                if (room.energyAvailable >= 500) {
                    spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
                }
            } else if (creeps['upgrader'].length < 2) {
                if (room.energyAvailable >= 550) {
                    spawn.createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
                }
            // } else if (creeps['repair'].length < 1) {
            //     if (room.energyAvailable >= 500) {
            //         spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repair'});
            //     }
            // } else if (creeps['builder'].length < 2) {
            //     if (room.energyAvailable >= 500) {
            //         spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
            //     }
            } else if (creeps['roadcrew'].length < 1) {
                if (room.energyAvailable >= 500) {
                    spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'roadcrew'});
                }
            // } else if (creeps['wallcrew'].length < 1) {
            //     if (room.energyAvailable >= 500) {
            //         spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'wallcrew'});
            //     }
            // } else if (creeps.scout && creeps['scout'].length < 1) {
            //     if (room.energyAvailable >= 330) {
            //         spawn.createCreep([ATTACK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'scout'});
            //     }
            } else {
                // if (energyAvailable >= 600) {
                //     Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
                // }
            }
        }



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

        for (let x of towers) {
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













        
        for (let tower of towers) {
            roleTower.run(tower);
        }
        
    }
};

module.exports = role;

