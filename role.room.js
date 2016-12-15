let lib = require('lib');
var roleTower = require('role.tower');

function summarizeCurrentCreeps(room, roles) {
    let creeps = {};
    for (var role in roles) {
        creeps[role] = _.filter(Game.creeps, creep => creep.memory.role === role && creep.room.name === room.name);
    }

    return creeps;
}

// Get a count of all crreps currently spawned and spawing in this room
function summarizeSpawningCreeps(room, roles) {
    let spawning = {};
    for (var role in roles) {
        let keys = Object.keys(room.memory.spawnPriorityQueue);
        if (keys) {
            spawning[role] = keys.reduce((result, next) => {
                let j = _.filter(room.memory.spawnPriorityQueue[next], creep => creep.memory.role === role);
                return result.concat(j);
            }, [])
        }
    }

    return spawning; 
}


var role = {
    run: function(room, roles) {
        // console.log(`Room "${room.name}" has ${room.energyAvailable} energy of ${room.energyCapacityAvailable}`);

        // room.memory.spawnPriorityQueue = {};
        if (!room.memory.spawnPriorityQueue)
            room.memory.spawnPriorityQueue = {};


        // let creeps = {};
        // for (var role in roles) {
        //     creeps[role] = _.filter(Game.creeps, creep => creep.memory.role === role && creep.room.name === room.name);
        // }
        // let spawning = {};
        // // for (var role in {a:1,b:1,c:1,d:1}) {
        // for (var role in roles) {
        //     spawning[role] = 0;

        //     let keys = Object.keys(room.memory.spawnPriorityQueue);
        //     if (keys) {
        //         spawning[role] = keys.reduce((result, next) => {
        //             let j = _.filter(room.memory.spawnPriorityQueue[next], creep => creep.memory.role === role);
        //             return result.concat(j);
        //         }, [])
        //     }
        // }
        let creeps = summarizeCurrentCreeps(room, roles);
        let spawning = summarizeSpawningCreeps(room, roles);


        let output = `${room.name}[${room.energyAvailable}/${room.energyCapacityAvailable}]:`;
        for (var role in roles) {
            if (creeps[role].length || spawning[role].length)
                output += `${role}: ${creeps[role].length}/${spawning[role].length} `;
        }
        console.log(output);


        function checkForSpawn(key, count) {
            return creeps[key].length + spawning[key].length < count;
        }

        // function checkForSpawn(key, count) {
        //     return creeps[key].length + spawning[key].length < count;
        // }
        function queueSpawn(priority, body, memory) {
            // room.memory.spawnQueue.push({body: body, memory: memory});

            let queue = room.memory.spawnPriorityQueue;
            if (!queue[priority])
                queue[priority] = [];
            queue[priority].push({body, memory});
        }


        // console.log('spawnPriorityQueue', JSON.stringify(room.memory.spawnPriorityQueue))
        // console.log('spawning', JSON.stringify(spawning))
        // console.log('_nextAvailableKey', _nextAvailableKey(room.memory.spawnPriorityQueue))
        // console.log('peek', peek(room.memory.spawnPriorityQueue))

        let construction = room.find(FIND_CONSTRUCTION_SITES, {
            filter: structure => structure.structureType != STRUCTURE_ROAD &&
                                    structure.structureType != STRUCTURE_WALL
        });
        let repairs = room.find(FIND_CONSTRUCTION_SITES, {
            filter: structure => structure.structureType != STRUCTURE_ROAD &&
						         structure.structureType != STRUCTURE_WALL &&
                                 structure.structureType != STRUCTURE_RAMPART &&
                                 structure.hits < structure.hitsMax &&
                                 structure.hits > 0
        });
        let towers = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_TOWER
        });

        let desiredCreeps = {};
        let totalCreepsAllowedInGroupB = 3; //room.memory.harvestLocations.length; //creeps['harvester'].length;
        let totalCreepsCurrentlyInGroupB = creeps['builder'].length + creeps['upgrader'].length;

        if (construction.length) {
            desiredCreeps['repair'] = 1;
            desiredCreeps['upgrader'] = 1;
            desiredCreeps['builder'] = Math.max(1, totalCreepsAllowedInGroupB - 2);
        } else {
            desiredCreeps['repair'] = 1;
            desiredCreeps['builder'] = 0;
            desiredCreeps['upgrader'] = totalCreepsAllowedInGroupB - 1;
        }
        // console.log(`max: ${totalCreepsAllowedInGroupB} ${JSON.stringify(desiredCreeps)}`)

        let context = {creeps, spawning, desiredCreeps, construction, towers};
        for (let role in roles) {
            if (roles[role].preprocess)
                roles[role].preprocess(room, context)
        }

        let workerBody;
        if (room.energyCapacityAvailable < 400) {
            workerBody = [WORK,CARRY,MOVE,MOVE];
        } else if (room.energyCapacityAvailable < 550) {
            workerBody = [WORK,WORK,CARRY,MOVE,MOVE,MOVE];
        } else { //if (room.energyCapacityAvailable < 700) {
            workerBody = [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
        }
        let h3Body;
        if (room.energyCapacity < 550) {
            h3Body = [WORK,WORK,MOVE,MOVE];
        } else { //if (room.energyCapacity < 750) {
            h3Body = [WORK,WORK,WORK,WORK,WORK,MOVE];
        // } else {
        //     h3Body = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE];
        }
        if (room.name === 'W79S36') {
            // if (creeps['harvester'].length + creeps['h3'].length === 0) {
            //     console.log('PANIC! THEY ARE ALL DEAD!!')
            //     queueSpawn(0, [WORK,CARRY,MOVE,MOVE], {role: 'harvester'});
            // }

            // if (checkForSpawn('harvester', room.memory.harvestLocations.length)) {
            //     queueSpawn(1, workerBody, {role: 'harvester'});
            // }
            if (checkForSpawn('h3', 2)) {
                queueSpawn(1, h3Body, {role: 'h3'});
            }
            if (checkForSpawn('upgrader', 1)) { //desiredCreeps['upgrader'])) {
                queueSpawn(5, workerBody, {role: 'upgrader'});
            }
            // if (checkForSpawn('builder', 0)) { //desiredCreeps['builder'])) {
            //     queueSpawn(3, workerBody, {role: 'builder'});
            // }
            if (checkForSpawn('repair', 1)) { //desiredCreeps['repair'])) {
                queueSpawn(9, workerBody, {role: 'repair'});
            }
            if (checkForSpawn('roadcrew', 2)) {
                queueSpawn(9, workerBody, {role: 'roadcrew'});
            }
            if (checkForSpawn('wallcrew', 1)) {
                queueSpawn(9, workerBody, {role: 'wallcrew'});
            }
            if (checkForSpawn('transport', 2)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
        }

        if (room.name === 'W78S36') {
            // if (creeps['harvester'].length + creeps['h3'].length === 0) {
            //     console.log('PANIC! THEY ARE ALL DEAD!!')
            //     queueSpawn(0, [WORK,CARRY,MOVE,MOVE], {role: 'harvester'});
            // }

            // if (checkForSpawn('harvester', room.memory.harvestLocations.length)) {
            //     queueSpawn(1, workerBody, {role: 'harvester'});
            // }
            // if (checkForSpawn('h3', 2)) {
            //     queueSpawn(1, h3Body, {role: 'h3'});
            // }
            if (checkForSpawn('upgrader', desiredCreeps['upgrader'])) {
                queueSpawn(5, workerBody, {role: 'upgrader'});
            }
            if (checkForSpawn('builder', desiredCreeps['builder'])) {
                queueSpawn(3, workerBody, {role: 'builder'});
            }
            // if (checkForSpawn('repair', desiredCreeps['repair'])) {
            //     queueSpawn(9, workerBody, {role: 'repair'});
            // }
            if (checkForSpawn('towertransport', towers.length)) {
                queueSpawn(5, [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'towertransport'});
            } 
            if (checkForSpawn('transport', 2)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
            
            if (checkForSpawn('roadcrew', 1)) {
                queueSpawn(9, workerBody, {role: 'roadcrew'});
            }
            // if (checkForSpawn('wallcrew', 1)) {
            //     queueSpawn(9, [WORK,CARRY,MOVE,MOVE], {role: 'wallcrew'});
            // }
        }

        let spawns = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_SPAWN
        });
        spawn = spawns[0];

        if (spawn && !spawn.spawning) {
            let next = lib.peek(room.memory.spawnPriorityQueue);
            if (next) {
                let rc = spawn.canCreateCreep(next.body);
                if (rc === OK) {
                    spawn.createCreep(next.body, next.name, next.memory);
                    lib.pop(room.memory.spawnPriorityQueue);
                } else if (rc !== ERR_NOT_ENOUGH_ENERGY) {
                    console.log(room.name, 'PANIC! INVALID BODY', JSON.stringify(next))
                    lib.pop(room.memory.spawnPriorityQueue);
                }
            }
        }
/*







        // let roads = room.find(FIND_CONSTRUCTION_SITES, {
        //     filter: structure => structure.structureType == STRUCTURE_ROAD
        // });
        // console.log('roads', roads.length);
        // if (roads.length)
        //     console.log('rc', roads[0].remove());
        // for (road of roads) {
        //     road.remove();
        // }

        if (!Memory.spawnQueue)
            Memory.spawnQueue = [];

        if (!room.memory.spawnQueue)
            room.memory.spawnQueue = [];

        // Memory.spawnQueue.push({foo: 'bar'})
        // console.log(Memory.spawnQueue)

        let queue = room.memory.spawnQueue.map(next => next.memory.role);
        // console.log(`spawn: ${queue.join(',')}`)
        // for (let next of room.memory.spawnQueue) {
        //     console.log('next', next.memory.role)
        // }


        let creeps = {};
        let spawning = {};
        let output = `${room.name}[${room.energyAvailable}/${room.energyCapacityAvailable}]:`;
        // console.log(`Room "${room.name}" has ${room.energyAvailable} energy of ${room.energyCapacityAvailable}`);
        // let soutput = `spawnq: `;
        for (var role in roles) {
            creeps[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room.name == room.name);
            spawning[role] = _.filter(room.memory.spawnQueue, (creep) => creep.memory.role == role);
            output += `${role}: ${creeps[role].length}/${spawning[role].length} `;
            // soutput += `${role}: ${spawning[role].length} `;
        }
        // console.log(output);
        // console.log(soutput);

        // let containers;
        let spawn;

        function prepareRoomContext() {
            let context = {};

            context.creeps = creeps;
            context.sources = room.find(FIND_SOURCES);
            // context.containers = room.find(FIND_STRUCTURES, {
            //     filter: structure => structure.type === STRUCTURE_CONTAINER
            // });
            context.storage = room.find(FIND_STRUCTURES, {
                filter: structure => structure.type === STRUCTURE_STORAGE
            });

            return context;
        }
        let roomContext = prepareRoomContext();

        // roles.h3.preprocess(room, roomContext);
        // roles.transport.preprocess(room, roomContext);

        lib.preprocessLitterQueue(room);
        lib.preprocessTransportQueue(room);

        let sources = roomContext.sources;
        if (room.energyCapacityAvailable >= 300) {

            let spawns = room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_SPAWN
            });
            spawn = spawns[0];
            // console.log('spawn', spawn)


/ *
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
* /            
        }

        let towers = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_TOWER
        });

        if (!room.memory.spawnPriorityQueue)
            room.memory.spawnPriorityQueue = {};

        function checkForSpawn(key, count) {
            return creeps[key].length + spawning[key].length < count;
        }
        function queueSpawn(priority, body, memory) {
            room.memory.spawnQueue.push({body: body, memory: memory});

            let queue = room.memory.spawnPriorityQueue;
            if (!queue[priority])
                queue[priority] = [];
            queue[priority].push({body, memory});
        }

        function pop() {
            let object = undefined;
            let queue = room.memory.spawnPriorityQueue;
            let sorted = Object.keys(queue).sort((a, b) => a - b);
            console.log('sorted', sorted)
            let key = sorted[0];
            console.log('key', key)

            if (key) {
                object = queue[key].shift();
                if (queue[key].length === 0)
                    delete queue[key];
            }

            return object;
        }

        // console.log('pop', JSON.stringify(pop()))

        // console.log('------', JSON.stringify(room.memory.spawnPriorityQueue))

        let spawnTargets = {
            'W63S23': {
                transport: 1,
                litter: 2
            },
            'W63S24': {

            }
        };

        if (room.name === 'W62S23') {
            // if (checkForSpawn('harvester', 1)) {
            //     queueSpawn([WORK,CARRY,MOVE], {role: 'harvester'});
            // } 
            if (checkForSpawn('h3', sources.length)) {
                queueSpawn(1, [WORK,WORK,MOVE,MOVE], {role: 'h3'});
            } 
            if (checkForSpawn('litter', 4)) {
                queueSpawn(3, [CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'litter'});
            } 
            if (checkForSpawn('transport', 2)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
            if (checkForSpawn('towertransport', towers.length)) {
                queueSpawn(5, [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], {role: 'towertransport'});
            } 
            if (checkForSpawn('repair', 1)) {
                queueSpawn(5, [WORK,CARRY,MOVE,MOVE], {role: 'repair'});
            } 
            if (checkForSpawn('wallcrew', 1)) {
                queueSpawn(9, [WORK,CARRY,MOVE,MOVE], {role: 'wallcrew'});
            } 
            if (checkForSpawn('roadcrew', 1)) {
                queueSpawn(9, [WORK,CARRY,MOVE,MOVE], {role: 'roadcrew'});
            } 
            if (checkForSpawn('builder', 1)) {
                queueSpawn(7, [WORK,CARRY,MOVE,MOVE], {role: 'builder'});
            } 
            if (checkForSpawn('upgrader', 8)) {
                queueSpawn(9, [WORK,CARRY,MOVE,MOVE], {role: 'upgrader'});
            }
        } else if (room.name === 'W63S23') {
            if (checkForSpawn('h3', sources.length)) {
                queueSpawn(1, [WORK,WORK,WORK,WORK,WORK,MOVE], {role: 'h3'});
            } 
            if (checkForSpawn('transport', 4)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
            if (checkForSpawn('litter', 1)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'litter'});
            } 
            if (checkForSpawn('builder', 1)) {
                queueSpawn(7, [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], {role: 'builder'});
            } 
            if (checkForSpawn('towertransport', towers.length)) {
                queueSpawn(5, [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], {role: 'towertransport'});
            } 
            if (checkForSpawn('miner', 1)) {
                queueSpawn(9, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'miner'});
            } 
            if (checkForSpawn('roadcrew', 1)) {
                queueSpawn(9, [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'roadcrew'});
            }
            if (checkForSpawn('upgrader', 2)) {
                queueSpawn(9, [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'upgrader'});
            }

        } else if (room.name === 'W63S24') {
            if (checkForSpawn('h3', sources.length)) {
                queueSpawn(1, [WORK,WORK,WORK,WORK,WORK,MOVE], {role: 'h3'});
            } 
            if (checkForSpawn('miner', 1)) {
                queueSpawn(9, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'miner'});
            } 
            if (checkForSpawn('litter', 1)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'litter'});
            } 
            if (checkForSpawn('transport', 4)) {
                queueSpawn(3, [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
            if (checkForSpawn('towertransport', towers.length)) {
                queueSpawn(5, [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'towertransport'});
            } 
            if (checkForSpawn('builder', 1)) {
                queueSpawn(7, [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], {role: 'builder'});
            } 
            if (checkForSpawn('upgrader', 4)) {
                queueSpawn(9, [WORK,WORK,WORK,WORK,WORK,
                            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'upgrader'});
            }
            if (checkForSpawn('roadcrew', 1)) {
                queueSpawn(9, [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'roadcrew'});
            }
        }

        if (spawn) {
            if (!spawn.spawning && room.memory.spawnQueue.length) {
                let next = room.memory.spawnQueue[0];
                let rc = spawn.canCreateCreep(next.body);
                if (rc === OK) {
                    spawn.createCreep(next.body, next.name, next.memory);
                    room.memory.spawnQueue.shift();
                } else if (rc !== ERR_NOT_ENOUGH_ENERGY) {
                    console.log('PANIC! INVALID BODY')
                }
            }

            else if (!spawn.spawning && Memory.spawnQueue.length) {
                let next = Memory.spawnQueue[0];
                let rc = spawn.canCreateCreep(next.body);
                if (rc === OK) {
                    spawn.createCreep(next.body, next.name, next.memory);
                    Memory.spawnQueue.shift();
                } else if (rc !== ERR_NOT_ENOUGH_ENERGY) {
                    console.log('PANIC! INVALID BODY')
                }
            }
        }






*/






        for (let name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.room.name === room.name) {
                if (roles[creep.memory.role] && roles[creep.memory.role].run) {
                    roles[creep.memory.role].run(creep, context);
                } else {
                    console.log('no run for role:', creep.memory.role);
                }
            }
        }


        
        for (let tower of towers) {
            roleTower.run(tower);
        }
        
    }
};

module.exports = role;

