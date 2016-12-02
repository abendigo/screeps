//let lib = require('lib');

var role = {
    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target} ${creep.ticksToLive}`)

        // if (!creep.memory.target)
        //     creep.memory.target = '57ef9ce186f108ae6e60cf37';

        // if (creep.memory.target) {
            let claim = Game.getObjectById('57ef9ce186f108ae6e60cf37')
            let other = Game.getObjectById(creep.memory.target);
            // console.log('claim', claim.room.name, other);

            let rc = creep.moveTo(claim);
            console.log('rc', rc)
        // }
        // if (creep.reserveController(claim) == ERR_NOT_IN_RANGE)
        //     creep.moveTo(claim);
    }
};

module.exports = role;
