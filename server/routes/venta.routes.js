'use strict'

const { Router, application } = require('express');
const router = Router();

const ventaController = require('../controllers/venta.controller');
const auth = require('../middlewares/authenticate');

router.post('/registro_compra_cliente', auth.auth,ventaController.registro_compra_cliente);



module.exports = router;