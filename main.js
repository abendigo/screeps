var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleScout = require('role.scout');
var roleSweeper = require('role.sweeper');

 let roles = {
 	'h2': require('role.h2')
 };


module.exports.loop = function () {
	for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy', 'of', Game.rooms[name].energyCapacityAvailable);
    }

	for (var i in Memory.creeps) {
		if (!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}	

    var roomName = 'W63S24';
    var room = Game.rooms[roomName];
    var energyAvailable = room.energyAvailable;
    var energyCapacityAvailable = room.energyCapacityAvailable;
    var home = 'home';

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
	var sweepers = _.filter(Game.creeps, (creep) => creep.memory.role == 'sweeper');

	console.log('harvestors', harvesters.length, 'upgraders', upgraders.length, 'builders', builders.length, 'repairs', repairs.length, 'sweepers', sweepers.length);

	// Always have 1 harvester, no matter what
	if (harvesters.length < 1) {
		if (energyAvailable >= 300) {
			var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			console.log('new harvestor', name);
		}
	}

	else if (energyCapacityAvailable < 550) {
		// if (harvesters.length < 1 && energyAvailable >= 300) {
		// 	var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
		// 	console.log('new harvestor', name);
		// }
		// if (builders.length < 2 && energyAvailable >= 300) {
		// 	var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'builder'});
		// 	console.log('new builder', name);
		// }
		// if (upgraders.length < 4 && energyAvailable >= 300) {
		// 	var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
		// 	console.log('new upgrader', name);
		// }
		// if (repairs.length < 2 && energyAvailable >= 300) {
		// 	var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'repair'});
		// 	console.log('new repair', name);
		// }
	} else if (energyCapacityAvailable <= 800) {
		if (harvesters.length < 2) {
			if (energyAvailable >= 550) {
				Game.spawns[home].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
			// } else if (energyAvailable >= 200) {
			// 	Game.spawns[home].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			}
		// } else if (upgraders.length < 4) {
		// 	if (energyAvailable >= 500) {
		// 		Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
		// 	}
		// } else if (repairs.length < 4) {
		// 	if (energyAvailable >= 550) {
		// 		Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'repair'});
		// 	}
		// } else if (builders.length < 4) {
		// 	if (energyAvailable >= 550) {
		// 		Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
		// 	}
		// } else {
		// 	if (energyAvailable >= 500) {
		// 		Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
		// 	}
		}
		// if (harvesters.length < 2 && energyAvailable >= 500) {
		// 	var name = Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
		// 	console.log('new harvestor', name);
		// }
		// if (upgraders.length < 4 && energyAvailable >= 500) {
		// 	var name = Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
		// 	console.log('new upgrader', name);
		// }

	} else {

	}

/*
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
*/
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep, {source: 1});
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, {source: 0});
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, {source: 1});
        }
        if (creep.memory.role == 'repair') {
        	roleRepair.run(creep, {source: 1});
        }
        if (creep.memory.role == 'scout') {
        	roleScout.run(creep);
        }
        if (creep.memory.role == 'sweeper') {
        	roleSweeper.run(creep);
        }

        if (creep.memory.role == 'h2') {
        	roles['h2'].run(creep);
        }
    }    
}


