let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ` + 
            `${creep.memory.target}/${creep.memory.home} energy:${creep.carry.energy}/${creep.carryCapacity} ` + 
            `ttl ${creep.ticksToLive}:${creep.memory.respawned}`);

        if (!creep.memory.state)
            creep.memory.state = 'harvest';
        if (!creep.memory.home)
            creep.memory.home = creep.room.name;

        if (!creep.memory.timing)
            creep.memory.statechange = [];

        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.state === 'deliver' && creep.carry.energy === 0) {
            console.log(creep.name, JSON.stringify(creep.memory.statechange));
            if (creep.memory.respawned) {
                creep.suicide();
            } else {
                creep.memory.statechange.push({'harvest': creep.ticksToLive});
                creep.memory.state = 'harvest';
            }
        }
        if (creep.memory.state !== 'deliver' && creep.carry.energy === creep.carryCapacity) {
            console.log(creep.name, JSON.stringify(creep.memory.statechange));
            creep.memory.statechange.push({'deliver': creep.ticksToLive});
            creep.memory.state = 'deliver';
        }

        if (creep.ticksToLive < 200 && !creep.memory.respawned) {
            console.log(`${creep.name} changes: ${JSON.stringify(creep.memory.statechange)}`)
            
            lib.queueSpawn(undefined, [WORK,WORK,MOVE,MOVE,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 
                {role: 'remoteHarvest', home: creep.memory.home, target: creep.memory.target})
            creep.memory.respawned = true;
        }

        // Game.spawns['home'].createCreep([WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,
        //     CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE], undefined, {role: 'remoteHarvest', target: 'W63S25'})

        if (creep.memory.state === 'deliver') {
            if (creep.memory.home && creep.memory.home !== creep.room.name) {
                creep.moveTo(new RoomPosition(10, 10, creep.memory.home))
                return;
            }

            let storage = creep.room.storage;
            if (creep.pos.isNearTo(storage)) {
                creep.transfer(storage, RESOURCE_ENERGY);
            } else { 
                creep.moveTo(storage);
            }
        } else {
            if (creep.memory.target && creep.memory.target !== creep.room.name) {
                creep.moveTo(new RoomPosition(10, 10, creep.memory.target))
                return;
            }

            let source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.pos.isNearTo(source)) {
                creep.harvest(source);
            } else {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = role;
