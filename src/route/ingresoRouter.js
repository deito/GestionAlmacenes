const router = require('express').Router();

const ingresoService = require('../service/ingresoService');

// guardar nuevo ingreso
router.post('/nuevoIngreso', ingresoService.nuevoIngreso);

// contar filas
router.get('/countRows', ingresoService.countRows);

// buscar por paginacion: cantidad de filas y pagina
router.post('/searchByPagination', ingresoService.searchByPagination);

module.exports = router;