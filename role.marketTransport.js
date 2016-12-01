let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        if (creep.fatigue || creep.spawning)
            return;

        // let terminal = Game.getObjectById('583fc1a2965f0ae4334deb6b');
        // let storage = Game.getObjectById('5834d53ba28559d70a076e2c');

        let total = _.sum(creep.carry);
        // if (creep.memory.state === 'deliver' && total == 0) {
        //     creep.memory.state = 'mining';
        // }
        // if (creep.memory.state !== 'deliver' && total == creep.carryCapacity) {
        //     creep.memory.state = 'deliver';
        // }
        if (total == 0) {
            creep.moveTo(creep.room.storage);
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            creep.withdraw(creep.room.storage, RESOURCE_ZYNTHIUM);
        } else {
            creep.moveTo(creep.room.terminal);
            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            creep.transfer(creep.room.storage, RESOURCE_ZYNTHIUM);
        }
    }
};

module.exports = role;
