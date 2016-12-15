let lib = require('lib');

var roleHarvester = {
    preprocess: function(room, context) {
        // delete room.memory.harvestLocations;
        // delete room.memory.sources;
        if (!room.memory.sources) {
            room.memory.sources = {};

            let sources = room.find(FIND_SOURCES);
            for (let source of sources) {
                room.memory.sources[source.id] = {
                    id: source.id,
                    mode: 'harvester'
                };
            }
        }

        if (!room.memory.harvestLocations) {
            room.memory.harvestLocations = [];

            let sources = room.find(FIND_SOURCES);

            for (let source of sources) {
                let locations = source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)

                let containerCreated = false;
                for (let location of locations) {
                    if (location.terrain !== 'wall') {
                        let crop = Object.assign({source: source.id, creep: 'available'}, location);

                        if (!containerCreated) {
                            let pos = new RoomPosition(location.x, location.y, room.name);
                            pos.createConstructionSite(STRUCTURE_CONTAINER);
                            containerCreated = true;

                            room.memory.sources[source.id].container = 'surveyed';
                            // room.memory.sources[source.id].location = location;
                            crop.container = 'surveyed';
                        }

                        room.memory.harvestLocations.push(crop);
                    }
                }
            }
        }

        if (room.memory.harvestLocations) {
            let xx = _.filter(room.memory.harvestLocations, next => next.container === 'surveyed');
            for (let next of xx) {
                let jj = room.lookForAt(LOOK_STRUCTURES, next.x, next.y);
                for (let i of jj) {
                    if (i.structureType === STRUCTURE_CONTAINER) {
                        room.memory.sources[next.source].mode = 'h3';
                        room.memory.sources[next.source].container = i.id;
                        next.container = 'available';
                    }
                }
            }
        }
        // if (room.memory.sources) {
        //     let xx = _.filter(room.memory.sources, next => next.container === 'surveyed');
        //     for (let next of xx) {
        //         let jj = room.lookForAt(LOOK_STRUCTURES, next.x, next.y);
        //         for (let i of jj) {
        //             if (i.structureType === STRUCTURE_CONTAINER) {
        //                 room.memory.sources[next.source].mode = 'h3';
        //                 room.memory.sources[next.source].container = i.id;
        //                 next.container = 'available';
        //             }
        //         }
        //     }
        // }
        // console.log(JSON.stringify(room.memory.harvestLocations));
        // console.log(JSON.stringify(room.memory.sources));
    },

    run: function(creep, context) {
        // console.log(`${creep.name}@${creep.room.name}: ${creep.memory.role}[${JSON.stringify(creep.memory.target)}]: ` +
        //     `${creep.memory.state}[${creep.carry.energy}/${creep.carryCapacity}] ttl ${creep.ticksToLive}`);

        // creep.suicide();
        if (creep.fatigue || creep.spawning)
            return;

        // if (creep.memory.home && creep.memory.home !== creep.room.name) {
        //     creep.moveTo(new RoomPosition(10, 10, creep.memory.home))
        //     return;
        // }

        if (!creep.memory.target) {
            for (let location of creep.room.memory.harvestLocations) {
                // console.log(creep.room.memory.harvestLocations.length, location.source, location.creep)
                if (location.creep !== 'available' && !Game.creeps[location.creep]) {
                    location.creep = 'available';
                }
                if (location.creep === 'available') {
                    creep.memory.target = location;
                    location.creep = creep.name;
                    break;
                }
            }
/*            
            // let sources = creep.memory
            let sources = creep.room.find(FIND_SOURCES);
            let harvesters = _.filter(Game.creeps, next => 
                next.memory.role === creep.memory.role && next.room.name === creep.room.name);

            creep.memory.target = harvesters.length % sources.length;

            let _sources = creep.memory.harvestLocations;
*/            
        }        

        if (!creep.memory.state)
            creep.memory.state = 'harvest';

        if (creep.memory.state === 'deliver' && creep.carry.energy === 0) {
            creep.memory.state = 'harvest';
        }
        if (creep.memory.state !== 'deliver' && creep.carry.energy === creep.carryCapacity) {
            creep.memory.state = 'deliver';
        }

        if (creep.memory.state === 'deliver') {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            let target = creep.memory.target;
            if (target) {
                // console.log('===', JSON.stringify(target))
                let source = Game.getObjectById(target.source)
                // let sources = creep.room.find(FIND_SOURCES);
                // let source = sources[creep.memory.target];
                // var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (!creep.pos.isNearTo(source)) {
                    creep.moveTo(source);
                } else {                    
                    creep.harvest(source);
                }
            }
        }
	}
};

module.exports = roleHarvester;

