var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');

module.exports.loop = function () {
	for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy', 'of', Game.rooms[name].energyCapacityAvailable);
    }

    var energyAvailable = Game.rooms['W27N68'].energyAvailable;
    var energyCapacityAvailable = Game.rooms['W27N68'].energyCapacityAvailable;
    var home = 'Spawn1';

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');

	console.log('harvestors', harvesters.length, 'upgraders', upgraders.length, 'builders', builders.length, 'repairs', repairs.length);


	if (harvesters.length < 2 && energyAvailable >= 200) {
		var name = Game.spawns[home].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
		console.log('new harvestor', name);
	}
	// if (harvesters.length < 2 && energyAvailable >= 550) {
	// 	var name = Game.spawns[home].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], { role: 'harvester' } );
	// 	console.log('new big harvestor', name);
	// }
	if (upgraders.length < 6 && energyAvailable >= 200) {
		var name = Game.spawns[home].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
		console.log('new upgrader', name);
	}
	// if (upgraders.length < 6 && energyAvailable >= 550) {
	// 	var name = Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
	// 	console.log('new upgrader', name);
	// }
	// if (builders.length < 2 && energyAvailable >= 400) {
	// 	var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
	// 	console.log('new builder', name);
	// }
	// if (repairs.length < 2 && energyAvailable >= 400) {
	// 	var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'repair'});
	// 	console.log('new builder', name);
	// }

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


