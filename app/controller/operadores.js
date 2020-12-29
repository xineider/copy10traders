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


var moment = require('moment');

const mongoose = require('mongoose');

const operadoresModel = require('../model/operadoresModel.js');

const contaModel = require('../model/contaModel.js');

const teste_conexaoModel = require('../model/conexaoTesteModel.js');

const usuario_operadoresModel = require('../model/usuariosOperadoresModel.js');

const sinalModel = require('../model/listaSinaisModel.js');

var licencaUser = require('../model/licencaModel.js');

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
						data[req.session.usuario.id+'_usuarios_operadores'] = {operadores:[]};
					}
					sinalModel.find({'deletado':0},function(err,data_sinal){

						var c_operador1 = 0;
						var c_operador2 = 0;
						var c_operador3 = 0;
						var c_operador4 = 0;
						var c_operador5 = 0;
						var c_operador6 = 0;
						var c_operador7 = 0;
						var c_operador8 = 0;
						var c_operador9 = 0;
						var c_operador10 = 0;


						if(data_sinal.length > 0){
							for(i=0;i<data_sinal.length;i++){

								if(data_sinal[i].operador == 1){
									c_operador1++;
								}
								if(data_sinal[i].operador == 2){
									c_operador2++;
								}

								if(data_sinal[i].operador == 3){
									c_operador3++;
								}

								if(data_sinal[i].operador == 4){
									c_operador4++;
								}

								if(data_sinal[i].operador == 5){
									c_operador5++;
								}

								if(data_sinal[i].operador == 6){
									c_operador6++;
								}

								if(data_sinal[i].operador == 7){
									c_operador7++;
								}

								if(data_sinal[i].operador == 8){
									c_operador8++;
								}

								if(data_sinal[i].operador == 9){
									c_operador9++;
								}

								if(data_sinal[i].operador == 10){
									c_operador10++;
								}

								console.log('data_sinal[i].operador: ' + data_sinal[i].operador);

								console.log('--------------------------');
							}

						}

						var quantidade_operacoes = [c_operador1,c_operador2,c_operador3,c_operador4,c_operador5,
						c_operador6,c_operador7,c_operador8,c_operador9,c_operador10];


						console.log('c_operador1:' + c_operador1);
						console.log('quantidade_operacoes: ' + quantidade_operacoes);

						data[req.session.usuario.id+'_qtd_operacoes'] = quantidade_operacoes;

						licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

							if(data_licenca != null){
								data[req.session.usuario.id + '_licenca_user'] = data_licenca;				
								hoje = new Date();
								data_fim = data_licenca.data_fim;
								data_inicio = data_licenca.data_inicio;
								console.log('data_fim:' + data_fim);
								console.log('data_inicio: ' + data_inicio);
								var data_fim_utc = new Date(Date.UTC(data_fim.getFullYear(),data_fim.getMonth(),data_fim.getDate()));
								console.log('data_fim_utc:' + data_fim_utc);
								moment.locale('pt-br');
								var data_fim_licenca_moment = moment.utc(data_licenca.data_fim).format('DD/MM/YYYY');

								data_fim.setDate(data_fim.getDate() + 1);
								data_inicio.setDate(data_inicio.getDate());
								diferencaData = data_fim - hoje;
								diferencaDataInicio = data_fim - data_inicio;

								dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;
								dias_faltantes_total = Math.floor(diferencaDataInicio / (1000 * 60 * 60 * 24));

								dias_passados = dias_faltantes_total - dias_faltantes;
								porcentagem_dias_passados = (dias_passados * 100 ) / dias_faltantes_total;

								console.log('diferencaDataInicio: ' + diferencaDataInicio);
								console.log('dias_faltantes_fim: ' + dias_faltantes);
								console.log('dias_faltantes_total: ' + dias_faltantes_total);
								console.log('dias_passados: ' + dias_passados);
								console.log('porcentagem_dias_passados:' + porcentagem_dias_passados);

								console.log(data_fim.getDate());

								console.log('data_fim_licenca_moment: ' + data_fim_licenca_moment);

								data[req.session.usuario.id + '_licenca_data_final'] = data_fim_licenca_moment;
								data[req.session.usuario.id + '_licenca_user_dias'] = dias_faltantes;
								data[req.session.usuario.id + '_porcentagem_dias_passados'] = porcentagem_dias_passados;
								req.session.usuario.creditos = data_licenca.creditos;
								req.session.usuario.licenca_data = data_fim;
								req.session.usuario.licenca_dias = dias_faltantes;
							}else{
								data[req.session.usuario.id + '_licenca_user'] = {creditos:0,licenca_user_dias:0,status:1};
								data[req.session.usuario.id + '_licenca_user_dias'] = -1;
							}




							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'operadores/operadores', data: data, usuario: req.session.usuario});
						});
					});
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

			var operadores_array = [parseInt(POST.numero_operador)];



			const new_usuario_operador = new usuario_operadoresModel({ 
				id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
				operadores:operadores_array,
				data_cadastro: new Date()
			});

			console.log('new_usuario_operador');
			console.log(new_usuario_operador);
			console.log('nnnnnnnnnnnnnnnnnnnnnn');

			new_usuario_operador.save(function (err) {
				if (err) {
					return handleError(err);
				}else{
					res.json(data);
				}
			});


		}

	});




});



router.get('/video-apresentacao/:id', function(req, res, next) {
	console.log('estou aqui no video-operador####');
	var numero_operador = req.params.id;


	operadoresModel.findOne({'numero':numero_operador},function(err,data_operador_v){
		console.log('-----data_operador-----------');
		console.log(data_operador_v);
		console.log('----------------');

		// data[req.session.usuario.id+'_operador_editar'] = data_operador;


		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'operadores/video_apresentacao', data: data, usuario: req.session.usuario});

	});
});



module.exports = router;
