const crypto = require('crypto');
//models
const Tarefa = require('../model/Tarefa')
const User = require('../model/User')
const Departamento = require('../model/Departamento')
const HistoricoTarefa = require('../model/HistoricoTarefa');

const { checkAndNotifyOverdueTasks } = require('../helpers/taskScheduler'); // Importe a função corretamente

//Helpers
const getToken = require('../helpers/get-token')
//biblioteca
const jwt = require('jsonwebtoken');

module.exports = class TarefaController {

    // Gera um número aleatório como id do cartão 
    static async generateUniqueRandomNumber() {
        const randomNum = crypto.randomInt(10000, 99999); // Gera um número aleatório entre 10000 e 99999 (5 dígitos)

        // Verifica se o número já existe no banco de dados
        const tarefaExists = await Tarefa.findOne({ where: { id_card: randomNum } });

        if (tarefaExists) {
            // Se o número já existe, chama a função novamente para obter um número único
            return TarefaController.generateUniqueRandomNumber();
        }

        return randomNum;
    }
    //Criar uma nova tarefa
    static async create(req, res) {

        const { description, title, status, predicted_end, department, priority } = req.body
        const available = true //sempre que um novo pet for cadastrado sera disponivel
        // Gera um número aleatório único de cinco dígitos para id_card
        const id_card = await TarefaController.generateUniqueRandomNumber();

        //validações
        if (!title) {
            res.status(422).json({ message: 'A titulo é obrigatório' })
            return
        }
        if (!status) {
            res.status(422).json({ message: 'O status da atividade é obrigatório' })
            return
        }
        if (!predicted_end) {
            res.status(422).json({ message: 'A data de finalização é obriatório' })
            return
        }
        if (!department) {
            res.status(422).json({ message: 'O departamento é obriatório' })
            return
        }
        if (!priority) {
            res.status(422).json({ message: 'A prioridade é obriatório' })
            return
        }

        //definindo quem cadastrou a tarefa
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')//decodificando o token para pegar o id
        currentUser = await User.findByPk(decoded.id)

        // Criando um registro no histórico informando a criação da tarefa
        const historicoDescricao = `${currentUser.name} criou a tarefa em ${new Date().toLocaleString()}, ${title}`;
        await HistoricoTarefa.create({
            descricao: historicoDescricao,
            data_alteracao: new Date(),
            UserId: currentUser.id,
        });


        //criando o objeto Tarefa
        const tarefa = new Tarefa({
            id_card: id_card,
            title: title,
            description: description,
            status: status,
            predicted_end: predicted_end,
            department: department,
            priority: priority,
            available: available,
            UserId: currentUser.id,
        })
        //salvando no banco de dados
        try {
            const newTarefa = await tarefa.save()
            res.status(200).json({ message: 'Tarefa cadastrado com sucesso', newTarefa })
        } catch (error) {
            res.status(500).json({ message: 'Erro no: ', error })
        }
    }
    //filtrar tarefa por usuario
    static async getAllUserTarefas(req, res) {
        // verificar o usuário logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        const tarefa = await Tarefa.findAll({
            where: { UserId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Departamento,
                as: 'departamento', // Use o alias definido na associação
                attributes: ['department'] // Especifique quais atributos do departamento você deseja incluir (por exemplo, o nome)
            }]
        });

        res.status(200).json({ tarefa });
    }

    static async getTarefaById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {// inNaN == é um Not a Number
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        //buscar pet pelo id
        const tarefa = await Tarefa.findByPk(id)

        //validando se o pet existe
        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não existe' })
            return
        }
        res.status(200).json({ tarefa: tarefa })
    }

    static async removeTarefaById(req, res) {
        const id = req.params.id //Regastando o ID que esta na URL

        if (isNaN(id)) {// inNaN == é um Not a Number
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        //buscar pet pelo id
        const tarefa = await Tarefa.findByPk(id)

        //validando se o pet existe
        if (!tarefa) {
            res.status(422).json({ message: 'Tarefa não existe' })
            return
        }

        //verificar usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        const currentUserId = currentUser.id

        await Tarefa.destroy({ where: { id: id } })
        res.status(200).json({ message: 'Tarefa deletada' })

    }

    static async checkTaskDueDate(tarefa) {
        const currentDate = new Date();
        const dueDate = new Date(tarefa.predicted_end);

        // Verifica se a data prevista de término é anterior à data atual
        if (dueDate < currentDate) {
            return true; // Tarefa está em atraso
        }

        return false; // Tarefa não está em atraso
    }


    static async updateTarefa(req, res) {
        const id = req.params.id;
        const { title, status, description, predicted_end, department, priority } = req.body;

        try {
            const tarefa = await Tarefa.findByPk(id);

            // Verifique se a tarefa está em atraso
            const isTaskOverdue = await TarefaController.checkTaskDueDate(tarefa);

            if (!tarefa) {
                res.status(404).json({ message: "Tarefa não existe!" });
                return;
            }

            let currentUser;
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');
            currentUser = await User.findByPk(decoded.id);

            if (tarefa.UserId !== currentUser.id) {
                res.status(422).json({ message: "ID inválido!" });
                return;
            }

            const updateData = {}; // Dados de atualização

            // Função para registrar alterações no histórico
            const registerHistorico = async (descricao) => {
                await HistoricoTarefa.create({
                    descricao,
                    data_alteracao: new Date(),
                    UserId: currentUser.id,
                    TarefaId: tarefa.id,
                });
            };

            if (tarefa.title !== title) {
                registerHistorico(`Título alterado de "${tarefa.title}" para "${title}"`);
                updateData.title = title;
            }
            if (tarefa.status !== status) {
                registerHistorico(`status alterado de "${tarefa.status}" para "${status}"`);
                updateData.status = status;
            }
            if (tarefa.predicted_end !== predicted_end) {
                registerHistorico(`previsão de termino alterado de "${tarefa.predicted_end}" para "${predicted_end}"`);
                updateData.predicted_end = predicted_end;
            }
            if (tarefa.department !== department) {
                // Alteração para registrar o nome do departamento em vez do ID
                const currentDepartment = await Departamento.findByPk(tarefa.department);
                const newDepartment = await Departamento.findByPk(department);
                const currentDepartmentName = currentDepartment ? currentDepartment.department : 'Nenhum departamento';
                const newDepartmentName = newDepartment ? newDepartment.department : 'Nenhum departamento';

                registerHistorico(`departamento alterado de "${currentDepartmentName}" para "${newDepartmentName}"`);
                updateData.department = department;
            }

            if (tarefa.description !== description) {
                registerHistorico(`descrição alterada`);
                updateData.description = description;
            }
            if (tarefa.priority !== priority) {
                registerHistorico(`prioridade alterada de "${tarefa.priority}" para "${priority}"`);
                updateData.priority = priority;
            }

            await tarefa.update(updateData);

            res.status(200).json({ message: "Atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Em TarefaController.js
    static async getHistoricoTarefa(req, res) {
        const tarefaId = req.params.id;

        try {
            const historico = await HistoricoTarefa.findAll({
                where: { TarefaId: tarefaId },
                order: [['data_alteracao', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['name'], // Substitua pelo atributo de nome do usuário
                    },
                ],
            });

            res.status(200).json({ historico });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}