//let lib = require('lib');

var role = {
    run: function(room, roles) {
        console.log(`Room "${room.name}" has ${room.energyAvailable} energy of ${room.energyCapacityAvailable}`);

        // let roads = room.find(FIND_CONSTRUCTION_SITES, {
        //     filter: structure => structure.structureType == STRUCTURE_ROAD
        // });
        // console.log('roads', roads.length);
        // if (roads.length)
        //     console.log('rc', roads[0].remove());
        // for (road of roads) {
        //     road.remove();
        // }

        let spawns = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_SPAWN
        });
        console.log('spawns', spawns);

        let creeps = {};
        let output = `${room.name}: `;
        for (var role in roles) {
            creeps[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room.name == room.name);
            output += `${role}: ${creeps[role].length} `;
        }
        console.log(output);

        if (creeps['harvester'].length < 1) {
            console.log(`${room.name}: need harvester`);
            if (room.energyAvailable >= 300) {
                var name = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            }
        }
        
    }
};

module.exports = role;

