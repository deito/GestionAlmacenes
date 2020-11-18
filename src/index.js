const express = require('express');
const morgan = require('morgan');

const app = express();

// settings
app.set('json spaces',2);

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/usuario',require('./route/usuarioRouter'));
app.use('/local', require('./route/localRouter'));
app.use('/rol/', require('./route/rolRouter'));

// Export the app instance
module.exports = app;