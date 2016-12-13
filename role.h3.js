let lib = require('lib');

var role = {
    preprocess: function(room, context) {
/*
        // if (!context.sources) {
        //     context.sources = room.find(FIND_SOURCES);
        // }
        let sources = context.sources;


        if (!room.memory.sources) {
            room.memory.sources = {};
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
        // console.log(`room.memory.sources: ${JSON.stringify(room.memory.sources)}`)
*/        
    },

    run: function(creep) {
        // console.log(`${creep.name}[${creep.memory.role}]@${creep.room.name}:${creep.memory.source} ttl ${creep.ticksToLive}:${creep.memory.respawned}`);

        if (creep.fatigue || creep.spawning)
            return;

        // if (creep.memory.home && creep.memory.home !== creep.room.name) {
        //     creep.moveTo(new RoomPosition(10, 10, creep.memory.home))
        //     return;
        // }

        // if (creep.ticksToLive < 200 && !creep.memory.respawned) {
        //     if (creep.room.energyCapacityAvailable < 550) {
        //         lib.queueSpawn(creep.room, [WORK,WORK,MOVE,MOVE], {role: 'h3', source: creep.memory.source})
        //     } else {
        //         lib.queueSpawn(creep.room, [WORK,WORK,WORK,WORK,WORK,MOVE], {role: 'h3', source: creep.memory.source})
        //     }
        //     creep.memory.respawned = true;
        // }

        if (!creep.memory.source && creep.room.memory.sources) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: structure => {
                    return creep.room.memory.sources[structure.id] == 'available';
                }
            });

            if (source) {
                creep.room.memory.sources[source.id] = creep.name;
                creep.memory.source = source.id;
            } else {
                console.log(creep.name, 'HELP NO EMPTY SOURCES');
                creep.suicide();
            }
        }

        if (creep.memory.source) {
            let target = Game.getObjectById(creep.memory.source);
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = role;
