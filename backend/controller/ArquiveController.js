const Arquive = require('../model/Arquive');
const Tarefa = require('../model/Tarefa');
const User = require('../model/User')
const arquiveUpload = require('../helpers/arquive-upload');
const fs = require('fs');
const path = require('path');

module.exports = class ArquiveController {
    static async uploadArquive(req, res) {
        try {
            const { TarefaID } = req.body;

            // Verifique se a tarefa existe
            const tarefa = await Tarefa.findByPk(TarefaID);
            if (!tarefa) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }

            // O arquivo foi carregado com sucesso, agora você pode criar um novo registro de Arquive
            const { filename } = req.file; // O nome do arquivo no sistema de arquivos
            const fileExtension = path.extname(filename).toLowerCase(); // Extraia a extensão do nome do arquivo

            // Verifique se a extensão é válida (você pode definir suas próprias regras aqui)
            if (!['.pdf', '.xls', '.txt', '.xlsx', '.docx', '.png', '.doc'].includes(fileExtension)) {
                return res.status(400).json({ message: 'Extensão de arquivo não suportada' });
            }

            // Obtenha o UserId do usuário autenticado (depende da sua lógica de autenticação)
            const userId = req.user.id;

            // Use o middleware de upload para processar o arquivo enviado pelo cliente
            arquiveUpload.single('arquivo')(req, res, async (err) => {

                // Crie um novo registro de Arquive no banco de dados
                const novoArquive = await Arquive.create({
                    arquive: filename, // Isso armazenará o nome original do arquivo no banco de dados
                    extensao: fileExtension, // Armazene a extensão derivada
                    UserId: userId,
                    TarefaID: TarefaID, // Certifique-se de que o nome da coluna seja correto
                });
                // Retorne uma resposta de sucesso
                return res.status(201).json({ message: 'Arquivo carregado com sucesso', data: novoArquive });
            });
        } catch (error) {
            console.error('Erro ao fazer o upload do arquivo:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async listarArquivosPorTarefa(req, res) {
        try {
            const { TarefaID } = req.params;
            // Verifique se a tarefa existe
            const tarefa = await Tarefa.findByPk(TarefaID);
            if (!tarefa) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }

            // Consulte o banco de dados para encontrar os arquivos relacionados a esta tarefa
            const arquivos = await Arquive.findAll({
                where: { TarefaID: TarefaID },
            });

            // Retorne a lista de arquivos como resposta
            return res.status(200).json({ arquivos });
        } catch (error) {
            console.error('Erro ao listar os arquivos da tarefa:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    
    static async downloadArquive(req, res) {
        try {
            const { arquivoId } = req.params;
            console.log(arquivoId)

            // Consulte o banco de dados para encontrar o nome do arquivo com base no ID
            const arquivo = await Arquive.findByPk(arquivoId);
            if (!arquivo) {
                return res.status(404).json({ message: 'Arquivo não encontrado' });
            }

            // Construa o caminho completo para o arquivo
            const filePath = path.join(__dirname, '../public/images/arquive', arquivo.arquive);

            // Verifique se o arquivo existe no sistema de arquivos
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'Arquivo não encontrado no sistema de arquivos' });
            }

            // Configurar cabeçalhos de resposta para forçar o download
            res.setHeader('Content-Disposition', `attachment; filename="${arquivo.arquive}"`);
            res.setHeader('Content-Type', 'application/octet-stream');

            // Envie o arquivo como uma resposta
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (error) {
            console.error('Erro ao fazer o download do arquivo:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async excluirArquivo(req, res) {
        try {
            const { arquivoId } = req.params;
    
            // Consulte o banco de dados para encontrar o arquivo com base no ID
            const arquivo = await Arquive.findByPk(arquivoId);
            if (!arquivo) {
                return res.status(404).json({ message: 'Arquivo não encontrado' });
            }
    
            // Construa o caminho completo para o arquivo
            const filePath = path.join(__dirname, '../public/images/arquive', arquivo.arquive);
    
            // Verifique se o arquivo existe no sistema de arquivos
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'Arquivo não encontrado no sistema de arquivos' });
            }
    
            // Exclua o arquivo do sistema de arquivos
            fs.unlinkSync(filePath);
    
            // Exclua o registro do arquivo do banco de dados
            await arquivo.destroy();
    
            // Responda com sucesso
            return res.status(200).json({ message: 'Arquivo excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir o arquivo:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    
 

};
