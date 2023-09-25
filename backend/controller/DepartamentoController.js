//models
const Departamento = require('../model/Departamento')
const User = require('../model/User')
//Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
//biblioteca
const jwt = require('jsonwebtoken')

module.exports = class DepartamentoController {

    //criar departamento
    static async create(req, res) {
        // console.log("Dados recebidos no servidor:", req.body); // Verifica se os dados estão chegando corretamente

        const { department } = req.body; // Mantenha o nome como 'department'

        const available = true //sempre que um novo pet for cadastrado sera disponivel
        if (!department) {
            res.status(422).json({ message: 'O departamento é obriatório' })
            return
        }

        //definindo quem cadastrou a tarefa
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')//decodificando o token para pegar o id
        currentUser = await User.findByPk(decoded.id)

        // Checa se o departamento já existe para o usuário atual
        const DepartmentExists = await Departamento.findOne({
            where: {
                department: department,
                UserId: currentUser.id // Adiciona a condição do UserId aqui
            }
        })

        if (DepartmentExists) {
            res.status(422).json({ message: "Departamento já cadastrado para este usuário" })
            return
        }

        //criando o objeto Tarefa
        const departamento = new Departamento({
            department: department,
            available: available,
            UserId: currentUser.id,
        })
        //salvando no banco de dados
        try {
            const newDepartamento = await departamento.save()
            res.status(200).json({ message: 'Departamento cadastrado com sucesso', newDepartamento })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    //mostrar departamento para o usuario
    static async getAllUserDepartamento(req, res) {
        //encontrando o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const departamento = await Departamento.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
        })

        res.status(200).json({ departamento })
    }
    //usuaio deletar um departamento
    static async removeDepartamentoById(req, res) {
        const id = req.params.id
        

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        //get pet by id
        const departamento = await Departamento.findByPk(id)

        //validando se o ID é valido
        if (!departamento) {
            res.status(422).json({ message: 'Departamento não existe' })
            return
        }

        //checar se o usuario logado registrou o pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Departamento.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Departamento removido com sucesso' })
    }

    static async getDepartamentoById(req, res) {
        const id = req.params.id

        const departamento = await Departamento.findByPk(id, { where: { id: id } })

        if (!departamento) {
            res.status(422).json({ message: "Departamento não encontrado" })
            return
        }

        res.status(200).json({ departamento })

    }
    
    static async updateDepartamento(req, res) {
        const id = req.params.id
        const { department } = req.body

        const updateData = {}
        const departamento = await Departamento.findByPk(id);

        if (!departamento) {
            res.status(404).json({ message: "Departamento não existe!" });
            return;
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (departamento.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        if (!department) {
            res.status(422).json({ message: "O departamento é obrigatório!" });
            return;
        } else {
            updateData.department = department
        }

        await Departamento.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "Departamento atualizado" })
    }


}