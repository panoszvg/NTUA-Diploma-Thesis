let DataTypes = require("sequelize").DataTypes;
let _Questions = require("./models");

function initModels(sequelize) {
    let Questions = _Questions(sequelize, DataTypes);

    return { Questions };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;