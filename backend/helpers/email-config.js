const nodemailer = require('nodemailer');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
        user: 'julialeticia100@gmail.com',
        pass: 'jqfcmxzhutrhuhye'
    }
});

module.exports = Transporter;
