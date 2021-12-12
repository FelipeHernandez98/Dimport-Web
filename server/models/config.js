'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Configchema = Schema({
 categorias: [{type: Object, required: true}],
 titulo: {type: String, required: true},
 serie: {type: String, required: true},
 correlativo: {type: String, required: true},
 
});

module.exports = mongoose.model('config', Configchema);