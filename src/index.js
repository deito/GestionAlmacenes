const express = require('express');
const morgan = require('morgan');

const app = express();

// settings
//app.set('json spaces',2);

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/usuario',require('./route/usuarioRouter'));
app.use('/local', require('./route/localRouter'));
app.use('/rol', require('./route/rolRouter'));
app.use('/cliente', require('./route/clienteRouter'));
app.use('/producto', require('./route/productoRouter'));
app.use('/proveedor', require('./route/proveedorRouter'));

// Export the app instance
module.exports = app;