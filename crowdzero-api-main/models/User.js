const Sequelize = require('sequelize');
const db = require('../configs/Database');

const User = db.define('user', {
    idu: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cargo:{
        type: Sequelize.INTEGER
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    pass:{
        type: Sequelize.STRING
    },
    contacto:{
        type: Sequelize.INTEGER
    },
    cc:{
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
    },
    idgoogle:{
        type: Sequelize.STRING
    },
},{timestamps: false})

module.exports = User;