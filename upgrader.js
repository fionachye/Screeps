var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (typeof(creep.memory.original_role) == 'undefined') {
            creep.memory.role = 'upgrader';
        }

        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        var alt_source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
            filter: (alt_source) => alt_source.energy > 100 || alt_source.ticksToRegeneration < 20
        });

        // if it has done upgrading (ie its cargo has have energy left)
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }

        // if it is carrying some energy but main source is depleted, order it to upgrade the controller regardless.
        if(!creep.memory.upgrading && creep.carry.energy > 0) {
            if(creep.carry.energy == creep.carryCapacity || source.energy == 0 || creep.ticksToLive < 30) {
                creep.memory.upgrading = true;
                creep.say('upgrading');
            }
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }

            if(creep.harvest(source) == ERR_NOT_ENOUGH_RESOURCES) {
                if(source.ticksToRegeneration > 20) {
                    if(creep.harvest(alt_source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(alt_source);
                    }
                }
                else {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleUpgrader;