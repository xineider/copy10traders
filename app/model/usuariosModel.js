var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	nome: String,
	email:String,
	senha:String,
	deletado:Number,
	nivel: Number
});

module.exports = mongoose.model('Usuarios', usuarioSchema,'usuarios');