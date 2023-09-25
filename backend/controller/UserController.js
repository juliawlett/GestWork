//UserController.js
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserById = require('../helpers/get-user-by-token')
const transporter = require('../helpers/email-config');

module.exports = class UserController {

    //create user
    static async register(req, res) {

        const { name, email, phone, password, confirmpassword } = req.body

        //regras de negocio
        if (!name) {
            res.status(422).json({ message: 'O nome do usuario é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email do usuario é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O phone do usuario é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'O password do usuario é obrigatório' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'O confirmpassword do usuario é obrigatório' })
            return
        }

        //criptografando a senha do user
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Checar se o usuario existe
        const userExists = await User.findOne({ where: { email: email } })

        if (userExists) {
            res.status(422).json({ message: 'Email já cadastrado' })
            return
        }

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            //criar novo user no banco
            const newUser = await user.save()

            // Enviar e-mail de boas-vindas
            const mailOptions = {
                from: 'Bem vindo ao GestWork! <julialeticia100@gmail.com>',
                to: newUser.email,
                subject: 'Seu registro já chegou aqui!',
                text: `Olá ${newUser.name},\n\nBem-vindo ao GestWork! Esperamos que você aproveite a plataforma.\n\nAtenciosamente,\nSua Equipe GestWork`
            };

            await transporter.sendMail(mailOptions);

            console.log(mailOptions)
            //Após criar o usuário, enviar para finalizar a criação com token
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    //aqui será a função de login
    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: "O email é obrigatório" })
            return
        }
        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória" })
            return
        }

        //checar se o email existe
        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            res.status(422).json({ message: "Email não cadastrado" })
            return
        }

        //checar se o password é igual ao do banco
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({ message: "Senha incorreta" })
            return
        }

        await createUserToken(user, req, res)
    }
    //checar os dados do usuario
    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)

            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findByPk(decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }
    //aqui vamos criar o getUserById()
    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findByPk(id, { where: { id: id } })

        if (!user) {
            res.status(422).json({ message: "Usuario não encontrado" })
            return
        }
        user.password = undefined
        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        //checando se o user existe
        const token = getToken(req)
        const user = await getUserById(token)
        const { name, email, phone, password, confirmpassword } = req.body

        //salvando a imagem
        let image = ''
        if (req.file) {
            image = req.file.filename
        }
        const userExists = await User.findOne({ where: { email: email } })

        user.email = email

        if (!phone) {
            res.status(422).json({ message: "O phone é obrigatório" })
            return
        }

        user.phone = phone

        if (password) {
            if (password !== confirmpassword) {
                res.status(422).json({ message: "As senhas devem ser iguais" })
                return
            } else if (password === confirmpassword != null) {
                //criando nova senha
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(password, salt)
                user.password = passwordHash
            }
        }

        const userToUpdate = await User.findByPk(id)

        if (!userToUpdate) {
            res.status(422).json({ message: "Usuario não encontrado" })
            return
        }

        userToUpdate.name = name
        userToUpdate.email = email
        userToUpdate.phone = phone
        userToUpdate.image = image

        if (password) {
            if (password === confirmpassword != null) {
                //criando nova senha
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(password, salt)
                userToUpdate.password = passwordHash
            }
        }

        try {
            await userToUpdate.save()
            res.status(200).json({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }


}
