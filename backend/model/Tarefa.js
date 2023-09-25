const { DataTypes } = require('sequelize');
const User = require('./User');
const db = require('../db/conn');
const Departamento = require('./Departamento'); // Importe o modelo Departamento
const Comentario = require('./Comentario')
const Arquive = require('./Arquive')

const Tarefa = db.define('Tarefa', {
    id_card: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    predicted_end: {
        type: DataTypes.DATEONLY, // Alterado para DATEONLY para armazenar apenas a data
        allowNull: false
    },
    department: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Tarefa.belongsTo(User);
User.hasMany(Tarefa);

// Associação com Departamento (chave estrangeira)
Tarefa.belongsTo(Departamento, {
    foreignKey: 'department', // nome da coluna que armazenará a chave estrangeira na tabela "Tarefa"
    as: 'departamento', // um alias para a associação
    allowNull: false
});
Departamento.hasMany(Tarefa, {
    foreignKey: 'department', // nome da coluna que armazenará a chave estrangeira na tabela "Tarefa"
    as: 'departamento', // um alias para a associação
    allowNull: false
});

// Associação virtual para acessar os comentários relacionados
Tarefa.hasMany(Comentario, {
    foreignKey: 'TarefaID', // Nome da coluna na tabela Comentario que referencia a Tarefa
    as: 'comentarios', // Alias para a associação virtual
});

Tarefa.hasMany(Arquive, {
    foreignKey: 'TarefaID', // Nome da coluna na tabela Comentario que referencia a Tarefa
    as: 'arquives', // Alias para a associação virtual
});


module.exports = Tarefa;
