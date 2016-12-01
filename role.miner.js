let lib = require('lib');

var role = {
    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        let total = _.sum(creep.carry);
        if (creep.memory.state === 'deliver' && total == 0) {
            creep.memory.state = 'mining';
        }
        if (creep.memory.state !== 'deliver' && total == creep.carryCapacity) {
            creep.memory.state = 'deliver';
        }

        lib.createRoadsAndQueueRepairs(creep);

        if (creep.memory.state === 'deliver') {

        } else {
            
        }
    }
};

module.exports = role;
