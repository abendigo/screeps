//let lib = require('lib');

var role = {
    run: function(room, roles) {
        console.log(`Room "${room.name}" has ${room.energyAvailable} energy of ${room.energyCapacityAvailable}`);

        let roads = room.find(FIND_CONSTRUCTION_SITES, {
            filter: structure => structure.structureType == STRUCTURE_ROAD
        });
        console.log('roads', roads.length);
        for (road of roads) {
            console.log('road', road);
        }

        let creeps = {};
        let output = `${room.name}: `;
        for (var role in roles) {
            creeps[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room.name == room.name);
            output += `${role}: ${creeps[role].length} `;
        }
        console.log(output);
    }
};

module.exports = role;

