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
        let output = `${room.name}: `;
        // let soutput = `spawnq: `;
        for (var role in roles) {
            creeps[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room.name == room.name);
            spawning[role] = _.filter(room.memory.spawnQueue, (creep) => creep.memory.role == role);
            output += `${role}: ${creeps[role].length}/${spawning[role].length} `;
            // soutput += `${role}: ${spawning[role].length} `;
        }
        console.log(output);
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

        roles.h3.preprocess(room, roomContext);
        roles.litter.preprocess(room, roomContext);
        roles.transport.preprocess(room, roomContext);

        let sources = roomContext.sources;
        if (room.energyCapacityAvailable >= 300) {

            let spawns = room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_SPAWN
            });
            spawn = spawns[0];
            // console.log('spawn', spawn)


/*
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
*/            
        }

        let towers = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_TOWER
        });

        function checkForSpawn(key, count) {
            return creeps[key].length + spawning[key].length < count;
        }
        function queueSpawn(body, memory) {
            room.memory.spawnQueue.push({body: body, memory: memory});
        }

        let spawnTargets = {
            'W63S23': {
                transport: 1,
                litter: 2
            },
            'W63S24': {

            }
        };

        if (room.name === 'W63S23') {
            if (checkForSpawn('h3', sources.length)) {
                queueSpawn([WORK,WORK,WORK,WORK,WORK,MOVE], {role: 'h3'});
            } 
            if (checkForSpawn('transport', 4)) {
                queueSpawn([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
            if (checkForSpawn('litter', 1)) {
                queueSpawn([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'litter'});
            } 
            if (checkForSpawn('builder', 1)) {
                queueSpawn([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], {role: 'builder'});
            } 
            if (checkForSpawn('towertransport', towers.length)) {
                queueSpawn([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], {role: 'towertransport'});
            } 
            if (checkForSpawn('roadcrew', 1)) {
                queueSpawn([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'roadcrew'});
            }
            if (checkForSpawn('upgrader', 2)) {
                queueSpawn([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'upgrader'});
            }

        } else if (room.name === 'W63S24') {
            if (checkForSpawn('h3', sources.length)) {
                queueSpawn([WORK,WORK,WORK,WORK,WORK,MOVE], {role: 'h3'});
            } 
            // if (checkForSpawn('miner', 1)) {
            //     queueSpawn([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'miner'});
            // } 
            if (checkForSpawn('litter', 1)) {
                queueSpawn([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'litter'});
            } 
            if (checkForSpawn('transport', 4)) {
                queueSpawn([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'transport'});
            }
            if (checkForSpawn('towertransport', towers.length)) {
                queueSpawn([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'towertransport'});
            } 
            if (checkForSpawn('builder', 1)) {
                queueSpawn([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], {role: 'builder'});
            } 
            if (checkForSpawn('upgrader', 2)) {
                queueSpawn([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], {role: 'upgrader'});
            }
            if (checkForSpawn('roadcrew', 1)) {
                queueSpawn([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], {role: 'roadcrew'});
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

            if (!spawn.spawning && Memory.spawnQueue.length) {
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










/*
        for (let name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.room.name === room.name)
                if (roles[creep.memory.role]) {
                    roles[creep.memory.role].run(creep);
                } else {
                    console.log('no run for role:', creep.memory.role);
                }
        }
*/

        
        for (let tower of towers) {
            roleTower.run(tower);
        }
        
    }
};

module.exports = role;

