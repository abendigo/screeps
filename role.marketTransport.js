let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        if (creep.fatigue || creep.spawning)
            return;

        // if (creep.memory.room) {
        //     if (creep.room.name === creep.memory.name) {
        //         delete creep.memory.name;
        //     } else {

        //     }
        // }

        // let terminal = Game.getObjectById('583fc1a2965f0ae4334deb6b');
        // let storage = Game.getObjectById('5834d53ba28559d70a076e2c');

        let total = _.sum(creep.carry);
        if (creep.memory.state === 'deposit' && total == 0) {
            creep.memory.state = 'withdraw';
        }
        if (creep.memory.state !== 'deposit' && total == creep.carryCapacity) {
            creep.memory.state = 'deposit';
        }
        if (creep.memory.state !== 'deposit') {
            // creep.moveTo(creep.room.terminal);
            // creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            creep.moveTo(creep.room.storage);
            if (creep.carry[RESOURCE_ENERGY] === 0)
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY, 50);
            else                
                creep.withdraw(creep.room.storage, RESOURCE_ZYNTHIUM);
        } else {
            // creep.moveTo(creep.room.storage);
            creep.moveTo(creep.room.terminal);
            // creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            creep.transfer(creep.room.terminal, RESOURCE_ENERGY);
            creep.transfer(creep.room.terminal, RESOURCE_ZYNTHIUM);
        }
    }
};

module.exports = role;
