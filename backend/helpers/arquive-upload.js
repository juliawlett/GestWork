// arquive-upload.js

const multer = require('multer');
const path = require('path');

const arquiveStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destino do arquivo:', 'public/images/arquive');
        cb(null, 'public/images/arquive');
    },
    filename: (req, file, cb) => {
        console.log('Nome do arquivo original:', file.originalname);
        cb(null, file.originalname); // Mantém o nome original do arquivo
    },
});

const arquiveUpload = multer({
    storage: arquiveStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Limite de 10MB (ajuste conforme necessário)
    },
    fileFilter(req, file, cb) {
        const allowedExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.png'];
        const fileExtension = path.extname(file.originalname).toLowerCase();


        console.log('Extensão do arquivo:', fileExtension);

        
        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error("Por favor, envie apenas arquivos PDF, DOCX, DOC, XLSX ou XLS"));
        }
        
        cb(null, true);
    },
});

module.exports = arquiveUpload;
