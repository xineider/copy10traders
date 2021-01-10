var mongoose = require('mongoose');

const licencaSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	data_inicio:Date,
	data_fim: Date,
	creditos:Number,
	deletado:Number,
	vitalicia:Boolean
});

module.exports = mongoose.model('licenca', licencaSchema,'licenca');