const Sequelize = require('sequelize');
const db = require('../configs/Database');

const Report = db.define('report', {
    idr: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idl: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idu: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nivel: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{timestamps: false})

module.exports = Report;