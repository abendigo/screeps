let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        if (creep.fatigue || creep.spawning)
            return;

        
    
        if (creep.room.name === 'W63S24') {  // Home
            let exit = creep.pos.findClosestByRange(FIND_EXIT_RIGHT);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W62S24') {
            let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W62S23') {
        //     let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
        //     creep.moveTo(exit);
        // } else if (creep.room.name === 'W62S22') {
            let spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
            if (spawn) {
                if (creep.attack(spawn) == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn);
                }              
        }
    }
};

module.exports = role;
