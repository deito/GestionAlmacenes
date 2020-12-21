const express = require('express');
const morgan = require('morgan');

const app = express();

// settings
//app.set('json spaces',2);

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//for cors
app.use(function(req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

// Routes
app.use('/usuario',require('./route/usuarioRouter'));
app.use('/local', require('./route/localRouter'));
app.use('/rol', require('./route/rolRouter'));
app.use('/cliente', require('./route/clienteRouter'));
app.use('/producto', require('./route/productoRouter'));
app.use('/proveedor', require('./route/proveedorRouter'));
app.use('/turno', require('./route/turnoRouter'));
app.use('/almacen/ingresos', require('./route/ingresoRouter'));
app.use('/almacen/salidas', require('./route/salidaRouter'));
app.use('/almacen/stock', require('./route/stockRouter'));
app.use('/operacion', require('./route/operacionRouter'));

// Export the app instance
module.exports = app;