'use strict'

const { Router, application } = require('express');
const router = Router();

const productoController = require('../controllers/producto.controller');
const auth = require('../middlewares/authenticate');

const multiparty = require('connect-multiparty');
const path = multiparty({ uploadDir: './uploads/productos' });

//Productos
router.post('/crear_producto', [auth.auth, path], productoController.crear_producto);
router.get('/listar_producto_filtro/:filtro?', auth.auth, productoController.listar_producto_filtro);
router.get('/obtener_portada/:img', productoController.obtener_portada);
router.get('/obtener_producto/:id', auth.auth, productoController.obtener_producto);
router.put('/actualizar_producto/:id', [auth.auth, path], productoController.actualizar_producto);
router.delete('/eliminar_producto/:id', [auth.auth, path], productoController.eliminar_producto);
router.put('/actualizar_variedades/:id', auth.auth, productoController.actualizar_variedades);
router.put('/agregar_imagen_galeria/:id', [auth.auth, path], productoController.agregar_imagen_galeria);
router.put('/eliminar_imagen_galeria/:id', auth.auth, productoController.eliminar_imagen_galeria);


//Inventario
router.get('/listar_producto/:id', auth.auth, productoController.listar_producto);
router.delete('/eliminar_inventario/:id', auth.auth, productoController.eliminar_inventario);
router.post('/crear_inventario', auth.auth, productoController.crear_inventario);

//PUBLICOS
router.get('/listar_producto_publico/:filtro?',productoController.listar_producto_publico);
router.get('/obtener_producto_slug/:slug', productoController.obtener_producto_slug);
router.get('/listar_productos_recomendados/:categoria', productoController.listar_productos_recomentados);

router.get('/listar_producto_nuevo_publico',productoController.listar_producto_nuevo_publico);
router.get('/listar_producto_masvendido_publico',productoController.listar_producto_masvendido_publico);

router.get('/obtener_reviews_producto/:id', productoController.obtener_review_producto);
module.exports = router;