var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}/${creep.memory.secondary}[${creep.memory.state}] ${creep.memory.target} ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax} count: ${creep.room.memory.count}`)

        if (creep.fatigue || creep.spawning)
            return;

        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        rc = creep.attack(target);
        if (rc === ERR_NOT_IN_RANGE)
            creep.moveTo(target);
            
    }
};

module.exports = role;
