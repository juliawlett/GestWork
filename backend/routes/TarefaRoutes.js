//TarefaRoutes.js
const router = require('express').Router()
const TarefaController = require('../controller/TarefaController')
const verifyToken = require('../helpers/verify-token')


// middlewares 
const {arquiveUpload} = require ('../helpers/arquive-upload')

//rotas privadas
//criar tarefa
router.post('/create', verifyToken, TarefaController.create)
/* mostrar tarefas do usuario logado */
router.get('/mytarefa', verifyToken, TarefaController.getAllUserTarefas)
/* Editar tarefa */
router.patch('/edit/:id', verifyToken, TarefaController.updateTarefa)
////Buscar tarefa por ID
router.get('/view/:id', TarefaController.getTarefaById)
// Em TarefaRoutes.js
router.get('/historico/:id', verifyToken, TarefaController.getHistoricoTarefa);
/* deletar um pet pelo id */
router.delete('/:id', verifyToken, TarefaController.removeTarefaById)

module.exports = router