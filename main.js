// var roleHarvester = require('role.harvester');
//var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');
// var roleRepair = require('role.repair');
var roleScout = require('role.scout');
// var roleSweeper = require('role.sweeper');
// var roleH2 = require('role.h2');

var roleTower = require('role.tower');

 let roles = {
    'builder': require('role.builder'),
 	'h2': require('role.h2'),
    'harvester': require('role.harvester'),
    'repair': require('role.repair'),
    'roadcrew': require('role.roadcrew'),
    'sweeper': require('role.sweeper'),
    'sweeper2': require('role.sweeper2'),
    'sweeper3': require('role.sweeper3'),
    'upgrader': require('role.upgrader'),
    'wallcrew': require('role.wallcrew'),
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

    let creeps = {};
    let output = '';
    for (var role in roles) {
        creeps[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        output += `${role}: ${creeps[role].length} `;
    }
    console.log(output);


    if (!room.memory.containers) {
        room.memory.containers = {};
    }
    console.log('memory.containers', JSON.stringify(room.memory.containers));

    let containers = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType == STRUCTURE_CONTAINER
    });
    console.log('containers', containers.length, creeps.h2.length);

    if (!room.memory.containers) {
        room.memory.containers = {};
    } else if (room.memory.containers.a) {
        delete room.memory.containers.a;
    }
    console.log('memory.containers', JSON.stringify(room.memory.containers));

    for (let x of containers) {
        if (room.memory.containers[x.id]) {
            if (room.memory.containers[x.id] == 'available') {
                console.log('--- container', x.id, 'available')
            } else {
                console.log('--- container', x.id,'assigned to', room.memory.containers[x.id])
                if (Game.creeps[room.memory.containers[x.id]]) {
                    console.log('still alive')
                } else {
                    console.log('dad dead daed')
                    room.memory.containers[x.id] = 'available';
                }
            }
        } else {
            room.memory.containers[x.id] = 'available';
        }
    }

    // var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	// var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	// var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	// var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
	// var sweepers = _.filter(Game.creeps, (creep) => creep.memory.role == 'sweeper');
    // var h2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'h2');

	// console.log('h2', h2.length, 'harvestors', harvesters.length, 'upgraders', upgraders.length, 'builders', builders.length, 'repairs', repairs.length, 'sweepers', sweepers.length);

	// Always have 1 harvester, no matter what
	if (creeps['harvester'].length < 1) {
		if (energyAvailable >= 300) {
			var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			console.log('new harvestor', name);
		}
    } else { //if (energyCapacityAvailable <= 800) {
        if (creeps['h2'].length < 4) {
            if (energyAvailable >= 300) {
                Game.spawns[home].createCreep([WORK,WORK,MOVE,MOVE], undefined, {role: 'h2'});
            }
        } else if (creeps['harvester'].length < 3) {
            if (energyAvailable >= 550) {
                Game.spawns[home].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
            }
        } else if (creeps['sweeper'].length < 2) {
            if (energyAvailable > 350) {
                Game.spawns[home].createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'sweeper'});
            }
        } else if (creeps['sweeper2'].length < 1) {
            if (energyAvailable > 350) {
                Game.spawns[home].createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'sweeper2'});
            }
        } else if (creeps['sweeper3'].length < 2) {
            if (energyAvailable > 350) {
                Game.spawns[home].createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'sweeper3'});
            }
        } else if (creeps['builder'].length < 1) {
            if (energyAvailable >= 600) {
                Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
            }
        } else if (creeps['roadcrew'].length < 1) {
            if (energyAvailable >= 500) {
                Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'roadcrew'});
            }
        } else if (creeps['wallcrew'].length < 1) {
            if (energyAvailable >= 500) {
                Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'wallcrew'});
            }
        } else if (creeps['upgrader'].length < 3) {
            if (energyAvailable >= 550) {
                Game.spawns[home].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
            }
        } else if (creeps['repair'].length < 1) {
            if (energyAvailable >= 500) {
                Game.spawns[home].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repair'});
            }
        } else {
            // if (energyAvailable >= 600) {
            //     Game.spawns[home].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
            // }
        }
    }


    for (let name in Game.creeps) {
        var creep = Game.creeps[name];

        if (roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        } else {
            console.log('no run for role:', creep.memory.role);
        }
    }

    let tower = Game.getObjectById('5833230ecbc9367a7f0c0afe');
    roleTower.run(tower);
}
