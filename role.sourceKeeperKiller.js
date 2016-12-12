let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}/${creep.memory.secondary}` + 
            `[${creep.memory.state}] ${creep.memory.target} ` + 
            `ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax}`)

        if (creep.fatigue || creep.spawning)
            return;


        let target = 'W64S24';

        if (creep.room.name !== target) {
            creep.moveTo(new RoomPosition(46, 24, target));
        } else {
            let evil = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            console.log(evil.pos, creep.pos, evil.pos.x - creep.pos.x, evil.pos.y - creep.pos.y)

            if (evil) {
                if (creep.hits < creep.hitsMax) {
                    creep.moveTo(new RoomPosition(43, 34, target));
                    creep.heal(creep);
                } else {
                    if (creep.rangedAttack(evil) === ERR_NOT_IN_RANGE)
                        creep.moveTo(evil);
                }
            } else {
                creep.moveTo(new RoomPosition(46, 24, target));
            }
        }
    }
};

module.exports = role;
