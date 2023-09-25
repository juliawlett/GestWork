// models/HistoricoTarefa.js
const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const Tarefa = require('./Tarefa');
const User = require('./User');

const HistoricoTarefa = db.define('HistoricoTarefa', {
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data_alteracao: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

HistoricoTarefa.belongsTo(User);
User.hasMany(HistoricoTarefa);

HistoricoTarefa.belongsTo(Tarefa);
Tarefa.hasMany(HistoricoTarefa);

module.exports = HistoricoTarefa;
