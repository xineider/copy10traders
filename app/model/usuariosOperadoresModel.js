var mongoose = require('mongoose');

const usuariosOperadoresSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	operadores:Array
});

module.exports = mongoose.model('usuarios_operadores', usuariosOperadoresSchema,'usuarios_operadores'); 