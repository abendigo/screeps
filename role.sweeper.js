var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, options) {

        var litter = creep.room.find(FIND_DROPPED_ENERGY);
        if (litter.length) {
            creep.say('don\'t litter!');

            if (creep.pickup(litter[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(litter[0]);
            }
        } else {

        }
    }
};

module.exports = roleUpgrader;