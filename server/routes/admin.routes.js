'use strict'

const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/authenticate');

const adminController = require('../controllers/Admin.controller');

router.post('/registro', adminController.create);
router.post('/login', adminController.login);

router.get('/obtener_mensajes_admin', auth.auth,adminController.obtener_mensajes_admin);
router.put('/cerrar_mensaje_admin/:id', auth.auth,adminController.cerrar_mensaje_admin);

router.get('/obtener_ventas_admin/:desde?/:hasta?',auth.auth,adminController.obtener_ventas_admin);

module.exports = router;