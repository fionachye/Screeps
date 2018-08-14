var structureTower = require('./tower');

var structureStructure = {
    run: function(id) {
        var structure = Game.getObjectById(id);

        if (structure) {
            if (structure.structureType === STRUCTURE_TOWER) {
                structureTower.run(structure);
            }
        }

    }
};

module.exports = structureStructure;