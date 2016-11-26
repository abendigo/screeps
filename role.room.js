//let lib = require('lib');

var role = {
    run: function(room) {
        console.log(`Room "${room.name}" has ${room.energyAvailable} energy of ${room.energyCapacityAvailable}`);
    }
};

module.exports = role;

