const Sequelize = require('sequelize');
const db = require('../configs/Database');

const Admins = db.define('admin', {
    ida: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contacto: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    }
}, {timestamps: false})

module.exports = Admins;