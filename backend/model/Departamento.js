const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const User = require('../model/User')

const Departamento = db.define('Departamento', {
    department: {
        type: DataTypes.STRING,
        allowNull: false,
      }
});

Departamento.belongsTo(User)
User.hasMany(Departamento)


module.exports = Departamento;
