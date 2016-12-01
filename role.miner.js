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
            if (creep.transfer(creep.room.storage, RESOURCE_ZYNTHIUM) === ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.storage);
        } else {
            let resource;
            if (!creep.memory.target) {
                resource = creep.pos.findClosestByRange(FIND_MINERALS);
                creep.memory.target = resource.id;
            } else {
                resource = Game.getObjectById(creep.memory.target);
            }
            if (resource) {
                if (creep.harvest(resource) === ERR_NOT_IN_RANGE)
                    creep.moveTo(resource);
            }
        }
    }
};

module.exports = role;
