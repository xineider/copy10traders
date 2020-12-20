// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
// var MeusDadosModel = require('../model/minhaContaModel.js');
// var model = new MeusDadosModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));



const mongoose = require('mongoose');

const operadoresModel = require('../model/operadoresModel.js');

const contaModel = require('../model/contaModel.js');

const teste_conexaoModel = require('../model/conexaoTesteModel.js');

const usuario_operadoresModel = require('../model/usuariosOperadoresModel.js');

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';

	data[req.session.usuario.id+'_numero_menu']= 3;

	operadoresModel.find({},function(err,data_operadores){

		console.log('operadores !!!');
		console.log(data);
		console.log('!!!!!!!!!!!!!!!!');
		data[req.session.usuario.id + '_operadores'] = data_operadores;

		contaModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
			if(data_conta !=null){
				data[req.session.usuario.id+'_conta']= data_conta;
			}else{
				data[req.session.usuario.id+'_conta']= {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:200,acao:'parar',status:'desconectado',primeira_vez:true};
			}

			teste_conexaoModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

				if(data_conexao != null){
					data[req.session.usuario.id+'_conexao'] = data_conexao;
				}else{
					data[req.session.usuario.id+'_conexao'] = {email:'',senha:'',status:'primeira_vez'};
				}

				usuario_operadoresModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuarios_operadores){
					console.log('data_usuarios_operadores');
					console.log(data_usuarios_operadores);
					if(data_usuarios_operadores != null){
						data[req.session.usuario.id+'_usuarios_operadores'] = data_usuarios_operadores;
					}else{
						data[req.session.usuario.id+'_usuarios_operadores'] = {operadores:[1,2,3,4,5,6,7,8,9,10]};
					}

					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'operadores/operadores', data: data, usuario: req.session.usuario});
				});
			}).sort({'data_cadastro':-1});
		}).sort({'data_cadastro':-1});
	});

});





router.post('/alterar-usuarios-operadores', function(req, res, next) {
	POST = req.body;

	console.log('qqqqqqqqqqqqqq ESTOU NO ALTERAR USUARIOS operadores qqqqqqqqqqq');
	console.log(POST);
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

	usuario_operadoresModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuarios_operadores){
		//quer dizer que ele já escolheu alguns operadores
		if(data_usuarios_operadores != null){
			array_operadores = data_usuarios_operadores.operadores;

			console.log('array_operadores');
			console.log(array_operadores);

			console.log('POST.checkado');
			console.log(POST.checkado);
			console.log(POST.checkado == true);

			//quer dizer que foi marcado alguém
			if(POST.checkado == 'true'){
				console.log('estou no true');
				array_operadores.push(parseInt(POST.numero_operador));
			}else{
				console.log('estou no false')
				array_operadores = array_operadores.filter(item => item !== parseInt(POST.numero_operador));
			}

			console.log('array_operadores');
			console.log(array_operadores);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');


			usuario_operadoresModel.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'operadores':array_operadores}},function(err){
				if (err) {
					return handleError(err);
				}else{

					res.json(data);
				}
			}).sort({'data_cadastro':-1});




		}else{

		}

	});




});




module.exports = router;
