const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'viveksojitra1110@gmail.com',
        pass: 'yonqmuqwxssvdcck'
    }
});

module.exports = transporter