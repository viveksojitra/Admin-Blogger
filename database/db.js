const mongoose = require('mongoose');

const connectionUrl = 'mongodb://localhost:27017/blogger';

mongoose.connect(connectionUrl)
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
