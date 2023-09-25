const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define o destino das imagens para a pasta de usuários
        cb(null, 'public/images/users');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg, png ou jpeg"));
        }
        cb(null, true);
    },
});

module.exports = { imageUpload };
