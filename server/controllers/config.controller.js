var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const configController = {};

configController.obtener_config = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {

            let reg = await Config.findById({ _id: "6177502b640b18d56ec7fe3e" });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAcces' });
        }
    } else {
        res.status(500).send({ message: 'NoAcces' });
    }
}

configController.actualizar_config = async(req, res) => {
    if (req.user) {
        if (req.user.role == 'administrador') {
            let data = req.body;

            if (res.files) {

                var img_path = req.files.logo.path;
                var name = img_path.split('/');
                var portada_name = name[2];

                let reg = await Config.findByIdAndUpdate({ _id: "6177502b640b18d56ec7fe3e" }, {
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo,
                });

                fs.stat('uploads/configuraciones/' + reg.logo, function(err) {
                    if (!err) {
                        fs.unlink('uploads/configuraciones/' + reg.logo, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                res.status(200).send({ data: reg });
            } else {
                let reg = await Config.findByIdAndUpdate({ _id: "6177502b640b18d56ec7fe3e" }, {
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo,
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

configController.obtener_logo = async(req, res) => {
    var img = req.params['img'];

    fs.stat('uploads/configuraciones/' + img, function(err) {
        if (!err) {
            let path_img = 'uploads/configuraciones/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = 'uploads/configuraciones/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

configController.obtener_publico = async(req, res) => {
    let reg = await Config.findById({ _id: "6177502b640b18d56ec7fe3e" });
    res.status(200).send({ data: reg });
}


module.exports = configController;