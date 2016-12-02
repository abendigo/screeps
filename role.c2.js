//let lib = require('lib');

var role = {
    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        if (!creep.memory.target)
            creep.memory.target = '57ef9ce186f108ae6e60cf37';

        let claim = Game.getObjectById(creep.memory.target)
        if (creep.reserveController(claim) == ERR_NOT_IN_RANGE)
            creep.moveTo(claim);
    }
};

module.exports = role;
