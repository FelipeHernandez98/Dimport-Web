'use strict'

const { Router } = require('express');
const router = Router();

const configController = require('../controllers/config.controller');
const auth = require('../middlewares/authenticate');

const multiparty = require('connect-multiparty');
const path = multiparty({ uploadDir: './uploads/configuraciones' });

router.put('/actualizar_config', [auth.auth, path], configController.actualizar_config);
router.get('/obtener_config', auth.auth, configController.obtener_config);
router.get('/obtener_logo/:img', configController.obtener_logo);
router.get('/obtener_publico',configController.obtener_publico);
module.exports = router;