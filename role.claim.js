//let lib = require('lib');
console.log('role.claim ==============================================================')
var role = {

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        if (creep.room.name === 'W63S24') {  // Home
            let exit = creep.pos.findClosestByRange(FIND_EXIT_RIGHT);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W62S24') {
            let exit = creep.pos.findClosestByRange(FIND_EXIT_NORTH);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W62S23') {
            let claim = Game.getObjectById('57ef9ce186f108ae6e60cf34')
            if (creep.reserveController(claim) == ERR_NOT_IN_RANGE)
                creep.moveTo(claim);
        }
    }
};

module.exports = role;
