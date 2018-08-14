var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (typeof(creep.memory.original_role) == 'undefined') {
            creep.memory.original_role = 'builder';
        }

        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        var alt_source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
            filter: (alt_source) => alt_source.energy > 100 || alt_source.ticksToRegeneration < 30
        });

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.role = creep.memory.original_role;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy > 0) {
            // TODO check if spawn energy is close to empty
            if(creep.carry.energy == creep.carryCapacity || source.energy == 0 || creep.ticksToLive < 30) {
                creep.memory.building = true;
                creep.say('building');
            }
        }

        if(creep.memory.building && creep.carry.energy > 0) {
            var closest_construction_site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // highest priority is to build construction site
            if (closest_construction_site) {
                if (creep.build(closest_construction_site) ==  ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest_construction_site);
                }
            }
            // repair structures if there's no construction site
            else {
                var closest_repair_site = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < (structure.hitsMax * 0.7) && structure.hits < 3000000
                });
                if (closest_repair_site) {
                    if (creep.repair(closest_repair_site) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest_repair_site);
                    }
                }

                else {
                    creep.memory.building = false;
                    creep.say('upgrading');
                    creep.memory.role = 'upgrader';
                }
            }
        }
        // switch role to harvester
        else {
            creep.memory.role = 'harvester';
        }
    }
};

module.exports = roleBuilder;