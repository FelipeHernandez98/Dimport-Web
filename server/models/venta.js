'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
    cliente: { type: Schema.ObjectId, ref:'cliente', required: true },
    nventa: { type: String, required: true },
    subtotal: { type: Number, required: true },
    transaccion: { type: String, required: true },
    estado: { type: String, required: true },
    direccion: { type: Schema.ObjectId,ref:'direccion', required: true },
    nota: { type: String, required: false },
    created: { type: Date, default: Date.now, require: true },
});

module.exports = mongoose.model('venta', VentaSchema);
