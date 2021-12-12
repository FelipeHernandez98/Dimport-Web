'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DireccionSchema = Schema({
    cliente: { type: Schema.ObjectId, ref: 'cliente', required: true },
    destinatario: {type: String, require:true},
    cedula: {type: String, require:true},
    direccion: {type: String, require:true},
    telefono: {type: String, require:true},
    principal: {type: Boolean, require:true},    
    createAt: {type: Date, default: Date.now, require: false},
});

module.exports = mongoose.model('direccion', DireccionSchema);