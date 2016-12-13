var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}/${creep.memory.secondary}[${creep.memory.state}] ${creep.memory.target} ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax} count: ${creep.room.memory.count}`)

        if (creep.fatigue || creep.spawning)
            return;

            creep.suicide();

        let target = 'W78S38'
        if (creep.room.name !== target) {
            creep.moveTo(new RoomPosition(23, 42, target));
        } else {
            let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
                // enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (!enemy) {
                enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            }
            rc = creep.attack(enemy);
            if (rc === ERR_NOT_IN_RANGE)
                creep.moveTo(enemy);
        }

        // let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // rc = creep.attack(target);
        // if (rc === ERR_NOT_IN_RANGE)
        //     creep.moveTo(target);
            
    }
};

module.exports = role;
