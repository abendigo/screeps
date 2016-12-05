
var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target} ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax}`)

        if (creep.fatigue || creep.spawning)
            return;

        if (!creep.memory.target)
            creep.memory.target = 'W62S21';

        if (creep.hits < creep.hitsMax)
            creep.heal(creep);
        creep.moveTo(new RoomPosition(23, 48, creep.memory.target))
    
    }
};

module.exports = role;
