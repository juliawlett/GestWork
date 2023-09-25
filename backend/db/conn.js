const { Sequelize } = require('sequelize')
const dados = require('../.env')

const sequelize = new Sequelize(dados.nomeBanco, dados.user, dados.password, { //alterar nome do banco
    host: 'localhost',
    dialect: 'mysql'
})

try{
    sequelize.authenticate()
    console.log('Conectado ao banco --->')

} catch(error){
    console.log('Não foi possivel conectar ao banco ', error)
}

module.exports = sequelize