// routes/comentarios.js
const router = require('express').Router()
const ComentarioController = require('../controller/ComentarioController');
const verifyToken = require('../helpers/verify-token')

// Rota para criar um comentário
router.post('/create/:id', verifyToken, ComentarioController.createComentario);

// Rota para listar comentários de uma tarefa
router.get('/:id/comentarios', ComentarioController.listComentarios);

module.exports = router;
