// Adds some properties and methods to the Source object's prototype.
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (typeof(creep.memory.original_role) == 'undefined') {
            creep.memory.original_role = 'harvester';
        }

        var source;
        if (creep.memory.source) {
            source = Game.getObjectById(creep.memory.source);
        } else {
            /**
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (source) => !source.isSaturated()
            });
            */
            if (!source) {
                source = creep.pos.findClosestByPath(FIND_SOURCES);
            }
        }

        var alt_source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
            filter: (alt_source) => alt_source.energy > 100 || alt_source.ticksToRegeneration < 30
        });

        if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > 30) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.memory.source = source.id;
                creep.moveTo(source);
            }

            if(creep.harvest(source) == ERR_NOT_ENOUGH_RESOURCES) {
                // if sources run out of energy and creep has zero energy, go harvest the next source
                if(source.ticksToRegeneration > 30 && creep.carry.energy == 0) {
                    if(creep.harvest(alt_source) == ERR_NOT_IN_RANGE) {
                        creep.memory.source = alt_source.id;
                        creep.moveTo(alt_source);
                    }
                }
                // otherwise dump the resource at hand to the nearest extension/spawns
                else {
                    creep.memory.role = 'collector';
                }
            }
        }

        else {
            creep.memory.role = 'collector';
        }
    }
};

module.exports = roleHarvester;