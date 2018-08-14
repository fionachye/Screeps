// Adds some properties and methods to the Source object's prototype.
var roleCollector = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy > 0) {
            creep.memory.source = null;
            // SPAWN->EXTENSION->TOWER->CONTAINER->STORAGE
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                }
            });

            if (target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
            }

            else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_TOWER ) && structure.energy < structure.energyCapacity;
                    }
                });
                if (target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                }

                else {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
                        }
                    });
                    if (target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }

                    // if nothing else to do, change role to builder
                    else {
                        creep.memory.role = 'builder';
                    }
                }
            }
        }

        else {
            creep.memory.role = 'harvester';
        }
    }
};

module.exports = roleCollector;