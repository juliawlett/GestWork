const router = require('express').Router()
const UserController = require('../controller/UserController')

// middlewares 
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require ('../helpers/image-upload')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)

//rota protegida, só avessar caso esta logado
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)

module.exports = router