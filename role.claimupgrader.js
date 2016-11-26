let lib = require('lib');

var role = {
    run: function(creep) {
        console.log('claimupgrader', creep.name, creep.room.name, creep.memory.upgrading)
    
        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if (creep.room.name === 'W63S24') {  // Home
            console.log('1')
            if (creep.memory.upgrading) {
                console.log('2')
                let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
                creep.moveTo(exit);
            } else {
                console.log('3')
                lib.refuel(creep);
            }
        } else if (creep.room.name === 'W63S23') {  // Target
            if (!creep.memory.upgrading) {
                let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                }
            } else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = role;
