// models/HistoricoTarefa.js
const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const Tarefa = require('./Tarefa');
const User = require('./User');

const Arquive = db.define('Arquive', {
    arquive: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    extensao:{
        type:DataTypes.STRING,
        allowNull: false,
    }
});

Arquive.belongsTo(User);
User.hasMany(Arquive);

module.exports = Arquive;
