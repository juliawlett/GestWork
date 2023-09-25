const jwt = require('jsonwebtoken')

async function createUserToken (user, req, res){
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, 'nossosecret') //mudar o nossosecret para melhorar a criptografia

    res.status(200).json({
        message: "Voce esta autenticado",
        token: token,
        userId: user.id
    })
}

module.exports = createUserToken