let lib = require('lib');

var roleUpgrader = {
    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        if (creep.memory.state === 'upgrading' && creep.carry.energy == 0) {
            creep.memory.state = 'fueling';
        }
        if (creep.memory.state !== 'upgrading' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.state = 'upgrading';
        }

        lib.createRoadsAndQueueRepairs(creep);

        if (creep.memory.state !== 'upgrading') {
            if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                if (creep.carry.energy > 0) {
                    creep.memory.state = 'upgrading';
                } else {
                    lib.park(creep);
                }
            }
        }
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;