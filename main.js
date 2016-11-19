var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
	for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

	console.log('harvestors', harvesters.length, 'upgraders', upgraders.length, 'builders', builders.length);

	if (harvestors.length < 2) {
		var name = Game.spawns['home'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
	}
	if (upgraders.length < 4) {
		var name = Game.spawns['home'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
	}
	if (builders.length < 3) {
		var name = Game.spawns['home'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
	}

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}


