var mongoose = require('mongoose');

const listaSinaisSchema = new mongoose.Schema({
	par:String,
	data:Date,
	direcao:String,
	tempo_expiracao:Number,
	executada:Boolean,
	operador:Number,
	deletado:Number,
	data_cadastro:Date
});

module.exports = mongoose.model('lista_sinais', listaSinaisSchema,'lista_sinais'); 