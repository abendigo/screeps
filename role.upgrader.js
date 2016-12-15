let lib = require('lib');

var role = {
	preprocess: function(room, context) {
		// console.log('upgrader preprocess', room.name)
	},

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        // creep.suicide();

        // if (creep.room.name === 'W62S23')
        //     console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

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

module.exports = role;
