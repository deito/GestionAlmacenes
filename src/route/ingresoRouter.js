const router = require('express').Router();

const ingresoService = require('../service/ingresoService');

// guardar nuevo ingreso
router.post('/nuevoIngreso', ingresoService.nuevoIngreso);

// contar filas
router.get('/countRows', ingresoService.countRows);

// buscar por paginacion: cantidad de filas y pagina
router.post('/searchByPagination', ingresoService.searchByPagination);

// obtener por id
router.get('/getById', ingresoService.getById);

// actualizar Ingreso por id y sus detalles
router.post('/update', ingresoService.update);

// contar filas con filtro de Tipo Ingreso y rango de Fechas de Ingreso
router.post('/countRowsByTipoIngresoAndRangoFecha', ingresoService.countRowsByTipoIngresoAndRangoFecha);

// buscar por tipo de ingreso, rango de fecha de ingreso y paginacion
router.post('/searchByTipoIngresoAndRangoFechaAndPagination', ingresoService.searchByTipoIngresoAndRangoFechaAndPagination);

module.exports = router;