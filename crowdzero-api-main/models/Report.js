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
    latr: {
        type: Sequelize.STRING,
        allowNull: false
    },
    longr: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nivel: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    }
},{timestamps: false})

module.exports = Report;