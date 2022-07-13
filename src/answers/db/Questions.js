const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Questions', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
            default: DataTypes.NOW
        },
        keywords: {
            type: DataTypes.ARRAY(DataTypes.STRING(50)),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'Questions',
        schema: 'answers-service',
        timestamps: false,
        indexes: [{
            name: "Questions_pkey",
            unique: true,
            fields: [
                { name: "id" },
            ]
        }, ]
    });
};