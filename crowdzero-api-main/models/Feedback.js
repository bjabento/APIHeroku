const Sequelize = require('sequelize');
const db = require('../configs/Database');

const Feedback = db.define('feedback', {
    idf: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idr: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idu: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    feedback: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {timestamps: false, freezeTableName: true})

module.exports = Feedback;