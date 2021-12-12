'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clienteSchema = Schema({
    nombres: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telefono: { type: String, required: false },
    cedula: { type: String, required: true },
    empresa: { type: String, required: false },
    created: { type: Date, default: Date.now, require: true }
});

module.exports = mongoose.model('cliente', clienteSchema);