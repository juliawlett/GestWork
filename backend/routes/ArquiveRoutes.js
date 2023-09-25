// routes/comentarios.js
const router = require('express').Router()
const ArquiveController = require('../controller/ArquiveController');
const verifyToken = require('../helpers/verify-token')
const arquiveUpload = require('../helpers/arquive-upload'); // Importe a função de upload de arquivos

// Rota para criar um comentário
router.post('/add/:id', verifyToken, arquiveUpload.single('arquivo'), ArquiveController.uploadArquive);
// Rota para listar comentários de uma tarefa
router.get('/list/:TarefaID',verifyToken, ArquiveController.listarArquivosPorTarefa);
// Define uma rota para fazer o download de um arquivo específico
router.get('/download/:arquivoId', ArquiveController.downloadArquive);
//Rota para deletar imagem
router.delete('/delete/:arquivoId', verifyToken, ArquiveController.excluirArquivo)

module.exports = router;
