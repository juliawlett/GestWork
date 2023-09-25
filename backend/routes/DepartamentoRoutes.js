//TarefaRoutes.js
const router = require('express').Router()
const DepartamentoController = require('../controller/DepartamentoController')
const verifyToken = require('../helpers/verify-token')

//rotas privadas
//criar departamento
router.post('/create', verifyToken, DepartamentoController.create)
/* mostrar pets do usuario logado */
router.get('/mydepartamentos', verifyToken, DepartamentoController.getAllUserDepartamento)
/* deletar um pet pelo id */
router.delete('/:id', verifyToken, DepartamentoController.removeDepartamentoById)
/* Editar Pet */
router.patch('/:id', verifyToken, DepartamentoController.updateDepartamento)
//Buscar departamento por ID
router.get('/:id', DepartamentoController.getDepartamentoById)


module.exports = router