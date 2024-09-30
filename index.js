const express = require('express');
const app = express();

const path = require('path');
const router = require('./routes/index');

const db = require('./database/db');
const User = require('./model/userModel');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('./config/passport')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, '/views')));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('express-session')({
    secret: 'godmod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

const port = 3002;
app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on http://localhost:${port}`);
    } else {
        console.error('Error starting server:', err);
    }
});
