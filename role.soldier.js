var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}/${creep.memory.secondary}[${creep.memory.state}] ${creep.memory.target} ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax} count: ${creep.room.memory.count}`)

// Game.spawns['home'].createCreep([TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,ATTACK,MOVE,ATTACK,MOVE], undefined, {role: 'soldier'})
// Game.spawns['home'].createCreep([ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'soldier'})
        if (creep.fatigue || creep.spawning)
            return;

        // creep.room.memory.count = 0;
        creep.suicide();
        creep.memory.state = 'attack';


        // if (!creep.memory.target)
        //     creep.memory.target = 'W62S21';
        if (!creep.room.memory.count)
            creep.room.memory.count = 0;

        if (!creep.memory.state)
            creep.memory.state = 'rally';

        if (creep.memory.state === 'rally') {
            let rallyPoint = new RoomPosition(13, 27, 'W62S22')

            let distance = 2;
            if (creep.room.memory.count >= 8)
                distance = 3;
            if (creep.room.memory.count >= 16)
                distance = 4;
            if (creep.room.memory.count >= 32)
                distance = 6;
            if (creep.room.memory.count >= 64)
                distance = 8;

            if (creep.pos.inRangeTo(rallyPoint, distance)) {
                creep.memory.state = 'waiting';
                creep.room.memory.count += 1;
            } else {
                creep.moveTo(rallyPoint);
            }
        }

        // if (creep.memory.state === 'waiting' && creep.room.memory.count >= 40) {
        //     creep.memory.state = 'attack';
        // }
        if (creep.memory.state === 'attack') {
//             if (creep.room.name !== 'W62S22') {
//                 if (creep.memory.secondary === 'bait') {
//                     creep.moveTo(new RoomPosition(44, 4, 'W63S22'));
//                 } else {
//                     creep.moveTo(new RoomPosition(23, 46, 'W63S22'));
//                 }
//             } else {
// console.log('------')                
//                 if (creep.memory.secondary === 'bait') {
//                     creep.moveTo(new RoomPosition(44, 4, 'W63S22'));
//                 } else {
                    // let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    // if (!target) {
                    //     target = Game.getObjectById('583589f352328ba21a9379ba'); // tower
                    // }
                    // if (!target) {
                        target = Game.getObjectById('5831f58a2873dc77620a886f'); // spawn
                    // }
                    console.log('xxxx', target)
                    if (target) {
                        let rc;
                        if (creep.memory.secondary === 'ranged') {
                            rc = creep.rangedAttack(target);
                        } else {
                            rc = creep.attack(target);
                        }
                        if (rc === ERR_NOT_IN_RANGE)
                            creep.moveTo(target);
                    }
            //     }
            // }
        }

        // if (creep.hits < creep.hitsMax)
        //     creep.heal(creep);
        // creep.moveTo(new RoomPosition(23, 48, creep.memory.target))
    
    }
};

module.exports = role;
