// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));


var moment = require('moment');

//var io = require("socket.io-client");

const mongoose = require('mongoose');

/*Liçenca do Usuário*/
var licencaModel = require('../model/licencaModel.js');

/*Usuário Conexão*/

const teste_conexaoModel = require('../model/conexaoTesteModel.js');

/*Conta do Usuário*/

const contaModel = require('../model/contaModel.js');

/*Mensagem*/

const mensagemModel = require('../model/mensagemModel.js');

/*entradas usuario*/

const entradasModel = require('../model/entradasModel.js');

const entradasTraderModel = require('../model/entradasTraderModel.js');

/*LOG*/

const log = require('../model/logModel.js');

/*Limite Usuários*/
const sessaoStatusModel= require('../model/sessaoModel.js');

/*Trader Limite*/
const traderLimiteModel = require('../model/traderLimiteModel.js');


/*Sessão dos Usuário*/
var sessao_usuarioModel = require('../model/usuarioSessao.js');

/*Sessão dos Usuário*/
var usuariosModel = require('../model/usuariosModel.js');

/*Sessão dos Usuário*/
var sessaoTotalModel = require('../model/sessaoTotalModel.js');

const operadoresModel = require('../model/operadoresModel.js');

const usuario_operadoresModel = require('../model/usuariosOperadoresModel.js');



/* GET pagina de login. */

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu']= 1;

	console.log('req.session.usuario');
	console.log(req.session.usuario);
	if(req.session.usuario.nivel == 3){

		licencaModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

			console.log('data_licenca');
			console.log(data_licenca);
			console.log('gggggggggggggggggggggggggggggggggggggggg');

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
				data[req.session.usuario.id + '_licenca_user'] = {creditos:0,licenca_user_dias:-1,status:1};
				data[req.session.usuario.id + '_licenca_user_dias'] = -1;
				data[req.session.usuario.id + '_porcentagem_dias_passados'] = 0;
			}

			contaModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
				if(data_conta !=null){
					data[req.session.usuario.id+'_conta']= data_conta;
				}else{
					data[req.session.usuario.id+'_conta']= {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:50,limite_perda:200,acao:'parar',status:'desconectado',primeira_vez:true};
				}

				teste_conexaoModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

					if(data_conexao != null){
						data[req.session.usuario.id+'_conexao'] = data_conexao;
					}else{
						data[req.session.usuario.id+'_conexao'] = {email:'',senha:'',status:'primeira_vez'};
					}

					mensagemModel.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0},function(err,data_mensagem){

						data[req.session.usuario.id + '_mensagem'] = data_mensagem;

						arrayMensagemData = [];

						if(data_mensagem.length > 0){

							for(i=0;i<data_mensagem.length;i++){

								var horario = new Date(data_mensagem[i].data_registro);
								horario.setHours(horario.getHours() - 3);
								dia_mensagem = horario.getDate();

								if(dia_mensagem > 0 && dia_mensagem < 10){
									dia_mensagem = "0" + dia_mensagem;
								}

								mes_mensagem = horario.getMonth() + 1;
								if(mes_mensagem > 0 && mes_mensagem < 10){
									mes_mensagem = "0" + mes_mensagem;
								}

								ano_mensagem = horario.getFullYear();

								hora_mensagem = horario.getHours();

								if(hora_mensagem >= 0 && hora_mensagem < 10){
									hora_mensagem = "0" + hora_mensagem;
								}

								minuto_mensagem = horario.getMinutes();

								if(minuto_mensagem >= 0 && minuto_mensagem < 10){
									minuto_mensagem = "0" + minuto_mensagem;
								}

								segundo_mensagem = horario.getSeconds();

								if(segundo_mensagem >= 0 && segundo_mensagem < 10){
									segundo_mensagem = "0" + segundo_mensagem;
								}


								data_concatenada = dia_mensagem + '/' + mes_mensagem + '/' + ano_mensagem + ' ' + hora_mensagem + ':' + minuto_mensagem + ':' + segundo_mensagem + ' - ';

								arrayMensagemData.push(data_concatenada);
							}

						}


						ts = Math.round(new Date().getTime() / 1000);
						tsYesterday = ts - (24 * 3600);
						console.log('tsYesterday:' + tsYesterday);

						entradasModel.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id),'deletado':0,'executada':true},function(err,data_entradas){


							console.log('-------------- data_entradas ----------');
							console.log(data_entradas);
							console.log('-------------------------------------------');

							acertos = 0;
							falha = 0;

							for(i=0;i<data_entradas.length;i++){
								if(data_entradas[i].vitoria == true){
									acertos++;
								}
							}

							if(data_entradas.length > 0){
								var porcentagem_a = (acertos * 100) / data_entradas.length;
								var porcentagem_round = Math.round(porcentagem_a);
								falha = data_entradas.length - acertos;
							}else{
								porcentagem_round = 100;
							}

							

							data[req.session.usuario.id+'_entrada_falha']= falha;
							data[req.session.usuario.id+'_entrada_acertos']= acertos;
							data[req.session.usuario.id+'_entrada_porcentagem_acertos']= porcentagem_round;
							data[req.session.usuario.id+'_entrada_nro_operacoes']= data_entradas.length;

							operadoresModel.find({},function(err,data_operadores){
								data[req.session.usuario.id+'_operadores']= data_operadores;

								usuario_operadoresModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuarios_operadores){
									console.log('data_usuarios_operadores');
									console.log(data_usuarios_operadores);
									if(data_usuarios_operadores != null){
										data[req.session.usuario.id+'_usuarios_operadores'] = data_usuarios_operadores;
									}else{
										data[req.session.usuario.id+'_usuarios_operadores'] = {operadores:[0]};
									}

									console.log('00000000000000 data 000000000000000000000');
									console.log(data);
									console.log('00000000000000000000000000000000000000000');

									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index', data: data, usuario: req.session.usuario});
								});
							});
						});
					}).sort({'data_registro':-1}).limit(20);
				}).sort({'data_cadastro':-1});
}).sort({'data_cadastro':-1});
});

}else{



	sessaoStatusModel.find({},function(err,data_sessao_status){

		if(data_sessao_status !=null){
			data[req.session.usuario.id+'_sessao_status'] = data_sessao_status;
		}else{
			data[req.session.usuario.id+'_sessao_status'] = {quantidade_usuarios:0};
		}

		sessaoTotalModel.find({},function(err,data_sessao_total){

			if(data_sessao_total != null){
				data[req.session.usuario.id+'_sessao_total'] = data_sessao_total;
			}else{
				data[req.session.usuario.id+'_sessao_total'] = {total_participantes_sessao:0,total_usuarios_conectados:0};
			}


			usuariosModel.find({nivel:3,deletado:0},function(err,data_usuarios){

				data[req.session.usuario.id+'_usuarios'] = data_usuarios;

				licencaModel.find({'deletado':0},function(err,data_licenca){

					if(data_licenca != null){

						var array_data_utc = [];


						for(i = 0; i< data_licenca.length;i++){
							data_fim = data_licenca[i].data_fim;
							console.log('data_fim');
							console.log(data_fim);
							var data_fim_utc = new Date(Date.UTC(data_fim.getFullYear(),data_fim.getMonth(),data_fim.getDate()));
							console.log('data_fim_utc:' + data_fim_utc);

							moment.locale('pt-br');
							var data_fim_licenca_moment = moment.utc(data_licenca[i].data_fim).format('DD/MM/YYYY');
							console.log('data_fim_licenca_moment');
							console.log(data_fim_licenca_moment);
							console.log('--------------------------------------------');

							array_data_utc.push({id_usuario : data_licenca[i].id_usuario,data_fim: data_fim_licenca_moment });

						}


						console.log('============ array_data_utc ================================');
						console.log(array_data_utc);
						console.log('============================================================');



						data[req.session.usuario.id+'_licenca_usuarios'] = array_data_utc;
					}else{
						data[req.session.usuario.id+'_licenca_usuarios'] = {sem_licenca:true};
					}



					traderLimiteModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_trader_limite){

						if(data_trader_limite !=null){
							data[req.session.usuario.id+'_trader_limite'] = data_trader_limite;
						}else{
							data[req.session.usuario.id+'_trader_limite'] = {limite_usuarios:200,limite_liquidez:50};
						}

						contaModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conta){
							if(data_conta != null){
								data[req.session.usuario.id+'_conta'] = data_conta;
							}else{
								data[req.session.usuario.id+'_conta'] = {conta_real:false,email:'',senha:'',tipo_banca:0,valor_entrada:100,limite_perda:200,acao:'parar',status:'desconectado'};
							}

							teste_conexaoModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

								if(data_conexao != null){
									data[req.session.usuario.id+'_conexao'] = data_conexao;
								}else{
									data[req.session.usuario.id+'_conexao'] = {email:'',senha:'',status:'primeira_vez'};
								}


								operadoresModel.find({},function(err,data_operadores){
									data[req.session.usuario.id+'_operadores_todos']= data_operadores;

									console.log('TTTTTTTTTTTTTTTTTTTTTTTTT TRADER TTTTTTTTTTTTTTTTTTTTTTTTTTTT');
									console.log(data);
									console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');


									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexTrader', data: data, usuario: req.session.usuario});

								});

							}).sort({'data_cadastro':-1});
						}).sort({'data_cadastro':-1});
					}).sort({'data_cadastro':-1});
				});
			});
		});
	});

}


});

router.get('/adicionar-usuario', function(req, res, next) {
	console.log('estou aqui no adicionar usuario!!!!!');
	var hoje = new Date();

	moment.locale('pt-br');
	var data_inicio_licenca = moment.utc(hoje).format('YYYY-MM-DD');

	console.log('data_inicio_licenca');
	console.log(data_inicio_licenca);
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	data[req.session.usuario.id+'_hoje_licenca'] = data_inicio_licenca;

	console.log('batata');
	console.log(data);
	console.log('aaaaaaaaaaaaaaaaa');



	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/adicionar_usuario', data: data, usuario: req.session.usuario});
});



router.get('/editar-operador/:id', function(req, res, next) {
	console.log('estou aqui no editar-operador####');
	var id_operador = req.params.id;


	operadoresModel.findById(mongoose.Types.ObjectId(id_operador),function(err,data_operador){
		console.log('-----data_operador-----------');
		console.log(data_operador);
		console.log('----------------');

		data[req.session.usuario.id+'_operador_editar'] = data_operador;


		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/editar_operador', data: data, usuario: req.session.usuario});

	});
});


router.get('/editar-usuario/:id', function(req, res, next) {
	console.log('estou aqui no editar-usuario@@@@');
	var id_usuario = req.params.id;


	usuariosModel.findById(mongoose.Types.ObjectId(id_usuario),function(err,data_usuario_e){

		console.log('-----data_usuario_e-----------');
		console.log(data_usuario_e);
		console.log('----------------');

		data[req.session.usuario.id+'_usuario_editar'] = data_usuario_e;

		licencaModel.findOne({'id_usuario':mongoose.Types.ObjectId(data_usuario_e._id)},function(err,data_licenca_e){
			console.log('-----data_licenca_e-----------');
			console.log(data_licenca_e);
			console.log('----------------');



			moment.locale('pt-br');
			var data_inicio_licenca = moment.utc(data_licenca_e.data_inicio).format('YYYY-MM-DD');
			var data_fim_licenca = moment.utc(data_licenca_e.data_fim).format('YYYY-MM-DD');

			console.log('data_inicio_licenca');
			console.log(data_inicio_licenca);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');

			console.log('data_fim_licenca');
			console.log(data_fim_licenca);

			data[req.session.usuario.id+'_usuario_editar_data_inicio_licenca'] = data_inicio_licenca;
			data[req.session.usuario.id+'_usuario_editar_data_fim_licenca'] = data_fim_licenca;
			data[req.session.usuario.id+'_usuario_editar_licenca'] = data_licenca_e;
			

			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/editar_usuario', data: data, usuario: req.session.usuario});
		}).sort({'_id':-1});;
	});
});


router.post('/popup-confirmacao-alterar-testar-conexao', function(req, res, next) {

	POST = req.body;

	teste_conexaoModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao_p){
		data.dados_c = data_conexao_p;
		console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
		console.log('estou dentro do load-container-testar-conexao');
		console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')

		console.log(data_conexao_p);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/confirmar_alterar_conta_conexao', data: data, usuario: req.session.usuario});

	}).sort({'data_cadastro':-1});

});


router.post('/atualizar-operador', function(req, res, next) {

	POST = req.body;
	console.log('___________ estou no atualizar operador ________');
	console.log(POST);
	console.log('_________________________________________________');


	operadoresModel.findOneAndUpdate({'_id':POST._id},{'$set':{'performance': POST.performance, 'nome': POST.nome, 'pais':POST.pais}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	}).sort({'data_cadastro':-1});

});


router.post('/cadastrar-usuario', function(req, res, next) {

	POST = req.body;
	console.log('estou no cadastrar-usuario!!!!!!!!');
	console.log(POST);
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	POST.email = POST.email.toLowerCase();
	var email_usuario = POST.email.trim();

	console.log('email_usuario:' + email_usuario);

	if(POST.nome != ''){
		if(POST.email != ''){

			usuariosModel.findOne({'email':email_usuario},function(err,data_usuario_existente){

				console.log('data_usuario_existente');
				console.log(data_usuario_existente);
				console.log('-------------------------');

				if(data_usuario_existente == null){


					nova_senha = Math.random().toString(36).substring(5);

					var novaSenhaCriptografa = control.Encrypt(nova_senha);

					console.log('nova_senha: '+nova_senha);
					console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);


					const novo_usuario = new usuariosModel({ 
						nome:POST.nome,
						email:POST.email,
						senha:novaSenhaCriptografa,
						deletado:0,
						nivel:3,
						data_cadastro:new Date()
					});

					console.log('novo_usuario');
					console.log(novo_usuario);


					var licenca_data_fim = new Date(POST.data_fim);
					var licenca_data_inicio = new Date(POST.data_inicio);

					console.log('licenca_data_fim:' + licenca_data_fim);
					console.log('POST.data_fim: ' + POST.data_fim);

					moment.locale('pt-br');
					var data_fim_licenca_moment = moment.utc(POST.data_fim).format('DD/MM/YYYY');
					console.log('data_fim_licenca_moment:' + data_fim_licenca_moment);



					var html = "<div style='background: #ffffff;width:100%;'>\
					<div style='margin:0px auto; max-width:600px;padding: 40px 0px;background: -webkit-linear-gradient(top, #423d64 0%, #aca9d2 100%);'>\
					<div style='width:100%;height:180px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
					<img style='max-width:280px;' src='http://copy10trader.com.br/public/images/Logo_CT.png'>\
					</div>\
					<div style='color:#8a8d93;width:100%;padding:20px;border-radius: 0px 30px 0 30px;padding: 10px;'>\
					<div style='margin:0 auto;width:80%;border-radius: 0px 30px 0 30px;background:#ffffff;padding:10px;'>\
					Parabéns, você adquiriu o Copy 10 Trader, para acessar o sistema vá para: <a href='http://copy10trader.com.br/' target='_blank'>http://copy10trader.com.br/</a>."+
					"<br>O e-mail da sua conta é este mesmo que está recebendo."+
					"<br>Sua senha no Copy 10 Trader é: "+nova_senha+
					"<br>A sua licença vai até:"+data_fim_licenca_moment+
					"<br>Caso não esteja conseguindo acessar o sitema, por-favor clique no botão esqueci minha senha!"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					'<div style="height:40px; padding:10px 20px;color:#8a8d93;width:80%;font-size:14px;">\
					* Não responda esta mensagem, ela é enviada automaticamente.'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>\
					</div>';
					var text = "Parabéns, você adquiriu o Copy 10 Trader, para acessar o sistema vá para: <a href='http://copy10trader.com.br/' target='_blank'>http://copy10trader.com.br/</a>."+
					"<br>O e-mail da sua conta é este mesmo que está recebendo."+
					"<br>Sua senha no Copy 10 Trader é: "+nova_senha+
					"<br>A sua licença vai até:"+data_fim_licenca_moment+
					"<br>Caso não esteja conseguindo acessar o sitema, por-favor clique no botão esqueci minha senha!"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					'<br>* Não responda esta mensagem, ela é enviada automaticamente.';


					control.SendMail(email_usuario, 'Acesso ao Copy 10 Trader',text,html);




					novo_usuario.save(function (err,user) {
						if (err) {
							console.log('err')
							console.log(err)
						}else{
							const nova_licenca = new licencaModel({ 
								id_usuario:mongoose.Types.ObjectId(user.id),
								data_inicio:licenca_data_inicio,
								data_fim:licenca_data_fim,
								creditos:9999,
								deletado:0
							});

							nova_licenca.save(function(err2,licenca){
								if(err2){
									console.log('err2');
									console.log(err2);
								}else{
									res.json(data);
								}
							});


						}
					});

				}else{
					res.json({error:'email_ja_cadastrado',element:'input[name="email"]',texto:'*Este Usuário com este e-mail já existe no sistema!'});
				}

			});

		}else{
			res.json({error:'email_vazio',element:'input[name="email"]',texto:'*Por-favor colocar um email para o usuário!'});
		}

	}else{
		res.json({error:'nome_vazio',element:'input[name="nome"]',texto:'*Por-favor colocar um nome para o usuário!'});
	}

});


router.post('/atualizar-usuario', function(req, res, next) {

	POST = req.body;
	console.log('___________ estou no atualizar usuario ________');
	console.log(POST);
	console.log('_________________________________________________');


	usuariosModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'nome': POST.nome,  'email':POST.email}},function(err){
		if (err) {
			return handleError(err);
		}else{

			var licenca_data_fim = new Date(POST.data_fim);
			var licenca_data_inicio = new Date(POST.data_inicio);

			licencaModel.findOneAndUpdate({'_id':POST.id_licenca},{'$set':{'creditos': 9999,  'data_inicio':licenca_data_inicio,'data_fim':licenca_data_fim}},function(err){
				res.json(data);
			});
		}
	}).sort({'data_cadastro':-1});

});






router.get('/load-container-testar-conexao', function(req, res, next) {

	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
	console.log('estou dentro do load-container-testar-conexao');
	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/testar_conexao_form', data: data, usuario: req.session.usuario});
});



router.get('/load-trader-opcoes-binarias', function(req, res, next) {

	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
	console.log('load-trader-opcoes-binarias');
	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/select_opcoes_binaria', data: data, usuario: req.session.usuario});
});


router.get('/load-trader-opcoes-digital', function(req, res, next) {

	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
	console.log('load-trader-opcoes-digital');
	console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/select_opcoes_digital', data: data, usuario: req.session.usuario});
});


router.post('/log', function(req, res, next) {
	POST = req.body;

	const new_log = new log({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		ip: POST[0], 
		method:POST[1],
		rota:POST[2],
		user_agent:POST[3],
		deletado:0,
		data_cadastro: new Date()
	});

	new_log.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});

});

router.post('/testar-conexao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO TESTAR CONEXAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();

	if(POST.email != ''){
		console.log('cai aqui dentro do POST.email dif vazio!!');

		if(POST.senha != ''){
			const teste_conexao = new teste_conexaoModel({ 
				id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
				email:POST.email,
				senha:POST.senha,
				status:'',
				deletado:0,
				data_cadastro:new Date()
			});

			console.log('tttttttttttttttt teste_conexao ttttttttttttttttt');
			console.log(teste_conexao);
			console.log('tttttttttttttttttttttttttttttttttttttttttttttttt');

			teste_conexao.save(function (err) {
				if (err) {
					return handleError(err);
				}else{
					res.json(data);
				}
			});
		}else{
			res.json({error:'senha_vazia',element:'input[name="senha"]',texto:'*Senha não pode ser Vazia!'});
		}
	}else{
		res.json({error:'email_vazio',element:'input[name="email"]',texto:'*Email não pode ser Vazio!'});
	}
});


router.post('/iniciar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');


	if(POST.valor_entrada >= 2){
		if(POST.limite_perda > 0){
			if(POST.valor_entrada % 1 === 0){
				if(POST.limite_perda % 1 ===0){
					if(parseInt(POST.limite_perda) > parseInt(POST.valor_entrada)){

						if(parseInt(POST.limite_perda) % parseInt(POST.valor_entrada) === 0){

							conta_real_t = false;
							if(POST.tipo_conta == 0){
								conta_real_t = true;
							}

							var dias_faltantes_licenca;

							if(req.session.usuario.licenca_dias == undefined){
								dias_faltantes_licenca = -1;
							}else{
								dias_faltantes_licenca = req.session.usuario.licenca_dias;
							}


							if(dias_faltantes_licenca >= 0){


								licencaModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca_i){

									console.log('data_licenca_i');
									console.log(data_licenca_i);
									console.log('-------------------------------');



									tipo_cliente = 'cliente';

									tipo_banca = 'numero';


									usuario_operadoresModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuarios_operadores_i){

										console.log('data_usuarios_operadores_i');
										console.log(data_usuarios_operadores_i);
										console.log('-----------------------------------------------');

										

										if(data_usuarios_operadores_i != null){

											console.log('data_usuarios_operadores_i.operadores.length');
											console.log(data_usuarios_operadores_i.operadores.length);
											console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

											if(data_usuarios_operadores_i.operadores.length > 0){


												teste_conexaoModel.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_conexao){

													contaModel.updateMany({'id_usuario':req.session.usuario.id},{'$set':{'acao':'parar'}},function(err2){

														const new_conta_user = new contaModel({ 
															id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
															tipo:tipo_cliente,
															email: data_conexao.email, 
															senha:data_conexao.senha,
															conta_real:conta_real_t,
															tipo_banca:tipo_banca,
															valor_entrada:POST.valor_entrada,
															limite_perda:POST.limite_perda,
															acao:'iniciar',
															status:'standby',
															deletado:0,
															data_fim_licenca: data_licenca_i.data_fim,
															data_cadastro: new Date()
														});

														console.log('new_conta_user');
														console.log(new_conta_user);
														console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

														new_conta_user.save(function (err) {
															if (err) {
																return handleError(err);
															}else{
																res.json(data);
															}
														});

													});


												}).sort({'data_cadastro':-1});

											}else{
												res.json({error:'escolher_operador',element:'#error_mensagem_conexao',texto:'Por-favor escolha um Trader para copiar!'});
											}
										}else{
											res.json({error:'escolher_operador',element:'#error_mensagem_conexao',texto:'Por-favor escolha um Trader para copiar!'});
										}

									});


								});

							}else{
								res.json({error:'acabou_licenca',element:'#error_mensagem_conexao',texto:'Você não possui licença, recarregue para continuar usando o sistema!'});
							}


						}else{
							res.json({error:'limite_perda_divisivel',element:'#error_mensagem_conexao',texto:'Valor de Stop deve ser divisível no mínimo 3x do valor de entrada: Exemplo: ' + (POST.valor_entrada * 3) + ' ou ' + (POST.valor_entrada * 4) + ' ou ' + (POST.valor_entrada * 5) + '.'});
						}

					}else{
						res.json({error:'limite_perda_num',element:'#error_mensagem_conexao',texto:'Valor de Stop não pode ser menor ou igual ao Valor da Entrada.'});
					}

				}else{
					res.json({error:'limite_perda_num',element:'#error_mensagem_conexao',texto:'Por-favor não colocar vírgulas no Valor de Stop. Ex: 100'});
				}
			}else{
				res.json({error:'qtd_valor_negativo',element:'#error_mensagem_conexao',texto:'Por-favor não colocar vírgulas no Valor de Entrada. Ex: 100'});
			}
		}else{
			res.json({error:'qtd_valor_negativo',element:'#error_mensagem_conexao',texto:'Valor de Stop deve ser maior que 0!'});
		}
	}else{
		res.json({error:'valor_maior_que_2',element:'#error_mensagem_conexao',texto:'Valor de Entrada tem que ser maior que 2!'});
	}



});


router.post('/parar-operacao', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR OPERACAO JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	contaModel.findOneAndUpdate({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'acao':'parar'}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	}).sort({'data_cadastro':-1});

});




router.post('/limpar-mensagens', function(req, res, next) {
	POST = req.body;

	console.log('HHHHHHHHHHHHHHH ESTOU NO LIMPAR MENSAGENS HHHHHHHHHHHHHHHHHHHH');
	console.log(POST);
	console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
	
	mensagemModel.updateMany({'id_usuario':req.session.usuario.id,'deletado':0},{'$set':{'deletado':1}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}		
	});
});


router.post('/limpar-mensagem/:id', function(req, res, next) {
	POST = req.body;

	id = req.params.id;

	console.log('@@@@@@@@@@@@@@ estou no limpar mensagem @@@@@@@');
	console.log(id);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	mensagemModel.findOneAndUpdate({'_id':id},{'$set':{'deletado':1}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});
	
});

router.get('/alterar-senha-usuario/:id_usuario', function(req, res, next) {

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no alterar-senha');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');



	var id_usuario = req.params.id_usuario;


	usuariosModel.findById(mongoose.Types.ObjectId(id_usuario),function(err,data_usuario_a){

		console.log('data_usuario_a');
		console.log(data_usuario_a);
		console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

		data[req.session.usuario.id+'_usuario_alterar_senha'] = data_usuario_a;

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/alterar_senha_usuario', data: data, usuario: req.session.usuario});


	});
});

router.get('/bloquear-usuario/:id_usuario', function(req, res, next) {

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no bloquear-usuario');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	var id_usuario = req.params.id_usuario;


	usuariosModel.findById(mongoose.Types.ObjectId(id_usuario),function(err,data_usuario_a){

		console.log('data_usuario_a');
		console.log(data_usuario_a);
		console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

		data[req.session.usuario.id+'_usuario_alterar_senha'] = data_usuario_a;

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/bloquear_usuario', data: data, usuario: req.session.usuario});


	});
});


router.post('/atualizar-senha-usuario', function(req, res, next) {

	POST = req.body;

	console.log('RECUPERAR SENHA @@@@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	console.log('usuario find model');
	nova_senha = Math.random().toString(36).substring(5);

	var novaSenhaCriptografa = control.Encrypt(nova_senha);

	console.log('nova_senha: '+nova_senha);
	console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){

		usuariosModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'senha':novaSenhaCriptografa}},function(err){
			if (err) {
				return handleError(err);
			}else{

				var html = "<div style='background: #ffffff;width:100%;'>\
				<div style='margin:0px auto; max-width:600px;padding: 40px 0px;background: -webkit-linear-gradient(top, #423d64 0%, #aca9d2 100%);'>\
				<div style='width:100%;height:180px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
				<img style='max-width:280px;' src='http://copy10trader.com.br/public/images/Logo_CT.png'>\
				</div>\
				<div style='color:#8a8d93;width:100%;padding:20px;border-radius: 0px 30px 0 30px;padding: 10px;'>\
				<div style='margin:0 auto;width:80%;border-radius: 0px 30px 0 30px;background:#ffffff;padding:10px;'>\
				Olá, você está recebendo este e-mail pois a administração resetou a sua senha."+
				"<br>Sua nova senha no Copy 10 Trader é: "+nova_senha+
				"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram."+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'<div style="height:40px; padding:10px 20px;color:#8a8d93;width:80%;font-size:14px;">\
				* Não responda esta mensagem, ela é enviada automaticamente.'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>\
				</div>';
				var text = "Olá, você está recebendo este e-mail pois a administração resetou a sua senha."+
				"<br>Sua nova senha no Copy 10 Trader é: "+nova_senha+
				"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'<br>* Não responda esta mensagem, ela é enviada automaticamente.';




				control.SendMail(data_usuario.email, 'Recuperação de Senha - Copy 10 Trader',text,html);				
				res.json(data);
			}
		});

	});

});



router.post('/banir-usuario', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@@@@ BANIR USUARIO @@@@@@@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){

		usuariosModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'deletado':1}},function(err){
			if (err) {
				return handleError(err);
			}else{

				var html = "<div style='background: #ffffff;width:100%;'>\
				<div style='margin:0px auto; max-width:600px;padding: 40px 0px;background: -webkit-linear-gradient(top, #423d64 0%, #aca9d2 100%);'>\
				<div style='width:100%;height:180px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
				<img style='max-width:280px;' src='http://copy10trader.com.br/public/images/Logo_CT.png'>\
				</div>\
				<div style='color:#8a8d93;width:100%;padding:20px;border-radius: 0px 30px 0 30px;padding: 10px;'>\
				<div style='margin:0 auto;width:80%;border-radius: 0px 30px 0 30px;background:#ffffff;padding:10px;'>\
				Olá, você está recebendo este e-mail pois a administração Baniu Sua Conta."+
				'<div style="height:40px; padding:10px 20px;color:#8a8d93;width:80%;font-size:14px;">\
				* Não responda esta mensagem, ela é enviada automaticamente.'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>\
				</div>';
				var text = "Olá, você está recebendo este e-mail pois a administração Baniu Sua Conta."+
				'<br>* Não responda esta mensagem, ela é enviada automaticamente.';




				control.SendMail(data_usuario.email, 'Conta Banida - Copy 10 Trader',text,html);				
				res.json(data);
			}
		});

	});

});




module.exports = router;