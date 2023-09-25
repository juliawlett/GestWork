// ComentarioModal (Comentario.js)
const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const User = require('../model/User');
const Tarefa = require('../model/Tarefa');

const Comentario = db.define('Comentario', {
    comentario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Comentario.belongsTo(User);
User.hasMany(Comentario)


module.exports = Comentario;
