'use strict'

const Producto = require('../models/producto');
const Inventario = require('../models/inventario');
const Administrador = require('../models/admin');
const Review = require('../models/review');
var fs = require('fs');
var path = require('path');

const productoController = {}


productoController.crear_producto = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {

            let data = req.body;

            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            console.log(img_path);
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            data.portada = portada_name;
            let reg = await Producto.create(data);

            let inventario = await Inventario.create({
                admin: req.user.sub,
                cantidad: data.stock,
                proveedor: 'Primer registro',
                producto: reg._id
            });

            res.status(200).send({ data: reg, inventario: inventario });
        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.listar_producto_filtro = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {
            let filtro = req.params['filtro'];
            if (filtro == 'null' || filtro == null) {
                let reg = await Producto.find({});
                res.status(200).send({ data: reg });
            } else {
                let regExp = new RegExp(filtro, 'i');
                let reg = await Producto.find({ $or: [{ titulo: regExp }, { categoria: regExp }] });
                res.status(200).send({ data: reg });
            }
        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.obtener_portada = async(req, res) => {
    var img = req.params['img'];

    fs.stat('uploads/productos/' + img, function(err) {
        if (!err) {
            let path_img = 'uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = 'uploads/productos/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

productoController.obtener_producto = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'administrador') {

            var id = req.params['id'];

            try {
                var reg = await Producto.findById({ _id: id });
                res.status(200).send({ data: reg });
            } catch (error) {
                res.status(200).send({ data: undefined });
            }

        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.actualizar_producto = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {

            let id = req.params['id'];
            let data = req.body;

            console.log(req.files);

            if (req.files) {
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];

                let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    portada: portada_name
                });

                fs.stat('uploads/productos/' + reg.portada, function(err) {
                    if (!err) {
                        fs.unlink('uploads/productos/' + reg.portada, (err) => {
                            if (err) throw err;
                        });
                    }
                })

                res.status(200).send({ data: reg });
            } else {
                let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                });
                res.status(200).send({ data: reg });
            }
        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.eliminar_producto = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {

            var id = req.params['id'];
            let reg = await Producto.findByIdAndRemove({ _id: id });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.listar_producto = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {

            var id = req.params['id'];

            var reg = await Inventario.find({ producto: id }).populate('admin');
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.eliminar_inventario = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {
            var id = req.params['id'];
    
            let inventario = await Inventario.findByIdAndRemove({ _id: id });
            let producto_inventario = await Producto.findById({ _id: inventario.producto });
            
            let nuevo_stock = parseInt(producto_inventario.stock) - parseInt(inventario.cantidad);
            let producto = await Producto.findByIdAndUpdate({ _id: inventario.producto }, { stock: nuevo_stock });
            res.status(200).send({ data: producto });

        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.crear_inventario = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {
            let data = req.body;
            let reg = await Inventario.create(data);
            let producto_inventario = await Producto.findById({ _id: reg.producto });
            
            let nuevo_stock = parseInt(producto_inventario.stock) + parseInt(reg.cantidad);
            let producto = await Producto.findByIdAndUpdate({ _id: reg.producto }, { stock: nuevo_stock });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.actualizar_variedades = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {

            let id = req.params['id'];
            let data = req.body;

            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                titulo_variedad : data.titulo_variedad,
                variedades: data.variedades
            });
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.agregar_imagen_galeria = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {
            let id = req.params['id'];
            let data = req.body;

            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            let reg = await Producto.findByIdAndUpdate({_id: id}, { $push: { galeria: {
                imagen : imagen_name,
                _id : data._id
            }}});
            
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

productoController.eliminar_imagen_galeria = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {
            let id = req.params['id'];
            let data = req.body;

            let reg = await Producto.findByIdAndUpdate({_id: id}, { $pull: { galeria: {_id : data._id}}});
            
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

//------------------------METODOS PUBLICOS -----------------------------

productoController.listar_producto_publico = async(req, res) => {
    let filtro = req.params['filtro'];
    if (filtro == 'null' || filtro == null) {
        let reg = await Producto.find({}).sort({created: -1});
        res.status(200).send({ data: reg });
    } else {
        let regExp = new RegExp(filtro, 'i');
        let reg = await Producto.find({ $or: [{ titulo: regExp }, { descripcion: regExp }, { categoria: regExp }] }).sort({created: -1});
        res.status(200).send({ data: reg });
    }
}

productoController.obtener_producto_slug = async(req, res) => {
    let slug = req.params['slug'];
    let reg = await Producto.findOne({ slug: slug});
    res.status(200).send({ data: reg });
}

productoController.listar_productos_recomentados = async(req, res) => {
    let categoria = req.params['categoria'];
    if (categoria == 'null' || categoria == null) {
        let reg = await Producto.find({}).sort({created: -1}).limit(8);
        res.status(200).send({ data: reg });
    } else {
        let regExp = new RegExp(categoria, 'i');
        let reg = await Producto.find({categoria: regExp}).sort({created: -1}).limit(8);
        res.status(200).send({ data: reg });
    }

}

productoController.listar_producto_nuevo_publico = async(req, res) => {      
    let reg = await Producto.find().sort({created: -1}).limit(8);
    res.status(200).send({ data: reg });  
}

productoController.listar_producto_masvendido_publico = async(req, res) => {      
    let reg = await Producto.find().sort({nventas: -1}).limit(8);
    res.status(200).send({ data: reg });  
}

productoController.obtener_review_producto = async(req, res) => {      
    let id = req.params['id'];
    let reg = await Review.find({producto: id}).sort({created: -1});
    res.status(200).send({ data: reg });  
}

module.exports = productoController;