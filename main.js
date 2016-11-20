var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');

module.exports.loop = function () {
	for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    var energyAvailable = Game.rooms['W31N61'].energyAvailable;

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');

	console.log('harvestors', harvesters.length, 'upgraders', upgraders.length, 'builders', builders.length, 'repairs', reparis.length);


	if (harvesters.length < 1 && energyAvailable >= 200) {
		var name = Game.spawns['home'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
		console.log('new harvestor', name);
	}
	if (harvesters.length < 3 && energyAvailable >= 550) {
		var name = Game.spawns['home'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], { role: 'harvester' } );
		console.log('new big harvestor', name);
	}
	if (upgraders.length < 4 && energyAvailable >= 200) {
		var name = Game.spawns['home'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
		console.log('new upgrader', name);
	}
	if (builders.length < 6 && energyAvailable >= 200) {
		var name = Game.spawns['home'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
		console.log('new builder', name);
	}
	if (repairs.length < 4 && energyAvailable >= 300) {
		var name = Game.spawns['home'].createCreep([WORK, WORK,CARRY,MOVE], undefined, {role: 'repair'});
		console.log('new builder', name);
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
        if (creep.memory.role == 'repair') {
        	roleRepair.run(creep);
        }
    }
}


