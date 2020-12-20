var mongoose = require('mongoose');

const operadoresSchema = new mongoose.Schema({
	nome:String,
	operacoes:Number,
	performance:Number,
	numero:Number,
	data_cadastro:Date,
	pais:String
});

module.exports = mongoose.model('operadores', operadoresSchema,'operadores'); 