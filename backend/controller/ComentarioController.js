// ComentarioController.js
const Comentario = require('../model/Comentario');
const Tarefa = require('../model/Tarefa');
const User = require('../model/User');
const HistoricoTarefa = require('../model/HistoricoTarefa');

module.exports = class ComentarioController {
    static async createComentario(req, res) {
        try {
            const { comentario, tarefaId } = req.body;

            // Verifique se a tarefa existe
            const tarefa = await Tarefa.findByPk(tarefaId);
            if (!tarefa) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }

            // Crie o comentário associado à tarefa
            const novoComentario = await Comentario.create({
                comentario,
                TarefaId: tarefaId,
                UserId: req.user.id, // Você precisa ter o usuário atualmente autenticado aqui
            });

            // Adicione o comentário ao histórico da tarefa
            await HistoricoTarefa.create({
                TarefaId: tarefaId,
                descricao: `comentário adicionado: ${comentario}`,
                data_alteracao: new Date(),
                UserId: req.user.id,
            });


            res.status(201).json({ message: 'Comentário criado com sucesso', comentario: novoComentario });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar comentário', error: error.message });
        }
    }

    static async listComentarios(req, res) {
        try {
            const tarefaId = req.params.id;

            // Verifique se a tarefa existe
            const tarefa = await Tarefa.findByPk(tarefaId);
            if (!tarefa) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }

            // Liste os comentários relacionados à tarefa
            const comentarios = await Comentario.findAll({
                where: { TarefaId: tarefaId },
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['name'], // Substitua pelo atributo de nome do usuário
                    },
                ],
            });

            res.status(200).json({ comentarios });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar comentários', error: error.message });
        }
    }

};