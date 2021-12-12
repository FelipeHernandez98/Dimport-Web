'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DventaSchema = Schema({
    producto: { type: Schema.ObjectId, ref:'producto', required: true },
    venta: { type: Schema.ObjectId,ref:'venta', required: true }, 
    subtotal: { type: Number, required: true },
    variedad: { type: String, required: false },
    cantidad: { type: String, required: true },
    cliente: { type: Schema.ObjectId, ref:'cliente', required: true },
    created: { type: Date, default: Date.now, require: true },
});

module.exports = mongoose.model('dventa', DventaSchema);