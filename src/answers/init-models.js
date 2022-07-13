var DataTypes = require("sequelize").DataTypes;
var _Questions = require("./db/Questions");
var _Answers = require("./db/Answers");

function initModels(sequelize) {
    var Questions = _Questions(sequelize, DataTypes);
    var Answers = _Answers(sequelize, DataTypes);

    // relationships between Tables
    Answers.belongsTo(Questions, { foreignKey: "QuestionsId" });
    Questions.hasMany(Answers, { foreignKey: "QuestionsId" });

    return { Answers, Questions };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;