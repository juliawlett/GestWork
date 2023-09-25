//Helpers/get-user-by-token.js
const jwt = require('jsonwebtoken')

const User = require('../model/User')

//buscar usuario com o jwt
async function getUserByToken(token) {
    if (!token) {
        return res.status(401).json({ message: "Acesso negado" })
    }
    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findOne({ id: userId })

    return user
}

module.exports = getUserByToken