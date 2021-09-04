const Sequelize = require('sequelize');
const db = require('../configs/Database');

const Locals = db.define('locals', {
    idl: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    latitude: {
        type: Sequelize.STRING(12),
        allowNull: false
    },
    longitude: {
        type: Sequelize.STRING(13),
        allowNull: false
    }
}, {timestamps: false})

module.exports = Locals;