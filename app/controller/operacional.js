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


const contaModel = require('../model/contaModel.js');

const teste_conexaoModel = require('../model/conexaoTesteModel.js');

const usuarioModel = require('../model/usuariosModel.js');

const operadoresModel = require('../model/operadoresModel.js');

const mensagemUser = require('../model/mensagemModel.js');

const sinalModel = require('../model/listaSinaisModel.js');

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';

	data[req.session.usuario.id+'_numero_menu']= 2;

	console.log('operacional !!!');
	console.log(data);
	console.log('!!!!!!!!!!!!!!!!');

	operadoresModel.find({},function(err,data_operadores){

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

				sinalModel.find({'deletado':0},function(err,data_sinal){

					console.log('00000000000000000000000000000 data_sinal 000000000000000000000');
					console.log(data_sinal);
					console.log('00000000000000000000000000000000000000000000000000000000000000');
					array_horario = [];
					array_par = [];
					array_direcao = []
					var par_otc = '';

					var contador_aguardando = 0;
					var contador_executadas = 0;

					for(i=0;i<data_sinal.length;i++){
						array_horario.push(moment(data_sinal[i].data).utc().format('DD/MM/YYYY HH:mm:ss'));

						var parUppercase = data_sinal[i].par.toUpperCase();

						var separacao = parUppercase.split('-');

						if(separacao.length>1){
							par_otc = separacao[0] + ' (' + separacao[1] + ')';
						}else{
							par_otc = separacao;
						}

						array_par.push(par_otc);
						array_direcao.push(data_sinal[i].direcao.toUpperCase());

						if(data_sinal[i].executada == true){
							contador_executadas++;
						}else if(data_sinal[i].executada == false){
							contador_aguardando++;
						}


					}



					var hoje = new Date();
					hoje.setDate(hoje.getDate() + 1);

					amanha = moment(hoje).utc().format('DD/MM/YYYY');

					data[req.session.usuario.id + '_dia_amanha'] = amanha;

					data[req.session.usuario.id + '_sinal_horario'] = array_horario;

					data[req.session.usuario.id + '_sinal_par'] = array_par;

					data[req.session.usuario.id + '_sinal_direcao'] = array_direcao;

					data[req.session.usuario.id + '_sinal'] = data_sinal;

					data[req.session.usuario.id + '_sinal_aguardando'] = contador_aguardando;

					data[req.session.usuario.id + '_sinal_executadas'] = contador_executadas;

					console.log('ddddddddddddddddddddddddddddddddd');
					console.log(data);
					console.log('ddddddddddddddddddddddddddddddddd');

					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'operacional/operacional', data: data, usuario: req.session.usuario});
				}).sort({'data':'asc'});
			}).sort({'data_cadastro':-1});
		}).sort({'data_cadastro':-1});

	});

});



router.post('/alterar-senha', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR alterar-senha JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	if(POST.senha_atual != ''){
		if(POST.nova_senha != ''){
			if(POST.repetir_nova_senha != ''){



				var verificarSenhaAtual =  control.Encrypt(POST.senha_atual);

				console.log('------------------------- verificarSenhaAtual ---------');
				console.log(verificarSenhaAtual);
				console.log('--------------------------------------------------------');

				usuarioModel.findOne({'_id':mongoose.Types.ObjectId(req.session.usuario.id),'senha':verificarSenhaAtual},function(err,data_usuario){
					
					if(data_usuario != null){

						if(POST.nova_senha == POST.repetir_nova_senha){

							if(POST.nova_senha.length >= 8){

								var novaSenhaCriptografa = control.Encrypt(POST.nova_senha);

								usuarioModel.findOneAndUpdate({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'senha':novaSenhaCriptografa}},function(err){
									if (err) {
										return handleError(err);
									}else{
										res.json(data);
									}
								});
							}else{
								res.json({error:'nova_senha',element:'#error_alterar_senha',texto:'*A nova senha deve ter mais que 8 caracteres!'});
							}

						}else{
							res.json({error:'repetir_nova_senha',element:'#error_alterar_senha',texto:'*Por-favor repetir corretamente a nova senha!'});
						}
					}else{
						res.json({error:'senha_atual_errada',element:'#error_alterar_senha',texto:'*Senha atual não confere!'});
					}

				});
			}else{
				res.json({error:'repetir_senha_vazia',element:'#error_alterar_senha',texto:'*Por-favor repetir a nova senha!'});
			}	
		}else{
			res.json({error:'nova_senha_vazia',element:'#error_alterar_senha',texto:'*Nova senha não pode ser vazia!'});
		}

	}else{
		res.json({error:'senha_atual_vazia',element:'#error_alterar_senha',texto:'*Senha atual não pode ser vazia!'});
	}


});



router.post('/popup-confirmacao-enviar-lista/:operador', function(req, res, next) {

	POST = req.body;

	var operador = req.params.operador;
	console.log('operador: ' + operador);

	var elementoErro = '#error_mensagem_lista_sinais_' +operador;

	console.log('elementoErro:' + elementoErro);

	console.log('=================================== ESTOU NO POP-UP CONFIRMACAO DE ENVIAR LISTA ===========================');
	console.log(POST);
	console.log('===========================================================================================================');

	if(POST.lista_sinais != ''){

		var arraySinais = POST.lista_sinais.split("\r\n");

		console.log('00000000 arraySinais 000000000');
		console.log(arraySinais);
		console.log('000000000000000000000000000000');

		var sinaisLimpo = [];

		var array_par_lista = [];

		var arrayContadorErros = [];

		var contadorLinhas = 0;

		var textoErro = '';

		var todos_sinais = ['AUDCAD','AUDCAD-OTC','AUDCHF','AUDJPY','AUDNZD','AUDUSD','CADCHF','CADJPY','CHFJPY','EURAUD','EURCAD','EURGBP',
		'EURGBP-OTC','EURJPY','EURJPY-OTC','EURNZD','EURUSD','EURUSD-OTC','GBPAUD','GBPCAD','GBPCHF','GBPJPY','GBPJPY-OTC','GBPNZD',
		'GBPUSD','GBPUSD-OTC','NZDUSD','NZDUSD-OTC','USDCAD','USDCHF','USDCHF-OTC','USDJPY','USDJPY-OTC','USDNOK'];


		for(i=0; i< arraySinais.length; i++){
			var sinal = arraySinais[i].split('-');

			contadorLinhas++;

			console.log('-------------------------- sinal -----------------');
			console.log(sinal);
			console.log('--------------------------------------------------');

			console.log('sinal.length: ' + sinal.length);

			if(sinal.length == 4){

				if(sinal != ''){

					console.log('sinal[0]: ' + sinal[0]);
					console.log('sinal[1]: ' + sinal[1]);
					console.log('sinal[2]: ' + sinal[2]);
					console.log('sinal[3]: ' + sinal[3]);

					var par_sinal = sinal[0].trim().toUpperCase().replace('_','-');

					console.log('par_sinal: ' + par_sinal);

					console.log('todos_sinais.indexOf(par_sinal): ' + todos_sinais.indexOf(par_sinal));

					if(todos_sinais.indexOf(par_sinal) >= 0){

						var direcao_sinal = sinal[1].trim().toUpperCase();

						if(direcao_sinal == 'CALL' || direcao_sinal == 'PUT'){

							var array_dia = sinal[2].split(/[:/ ]/);

							if(array_dia.length == 5){
								array_dia[5] = '00';
							}

							if(array_dia.length == 6){

								console.log('array_dia')
								console.log(array_dia);

								var dia_sinal = array_dia[0];

								console.log('parseInt(dia_sinal): ' + parseInt(dia_sinal));

								if(parseInt(dia_sinal)>0 && parseInt(dia_sinal)<32){


									var mes_sinal = array_dia[1] - 1;

									console.log('mes_sinal:' + mes_sinal);

									if(parseInt(mes_sinal)>= 0 && parseInt(mes_sinal)<12){


										var ano_sinal = array_dia[2];

										console.log('ano_sinal: ' + ano_sinal);


										//controle para ver se o usuario não colou só o numero final
										if(parseInt(ano_sinal)>0 && ano_sinal.length == 2){
											ano_sinal = '20' + ano_sinal;
										}

										var hoje = new Date();
										hoje.setHours(hoje.getHours() - 3);
										console.log('hoje: ' + hoje);


										if(parseInt(ano_sinal)>= hoje.getFullYear()){

											var dia = new Date(ano_sinal,mes_sinal,dia_sinal,array_dia[3],array_dia[4],array_dia[5]);



											var novo_horario_UTC = new Date(Date.UTC(ano_sinal,mes_sinal,dia_sinal,array_dia[3],array_dia[4],array_dia[5]));


											var dia_sem_horario = moment(novo_horario_UTC).utc().format('DD/MM/YYYY');
											var horario = moment(novo_horario_UTC).utc().format('HH:mm:ss');

											console.log('dia_sem_horario:' + dia_sem_horario);
											console.log('horario: ' + horario);


											console.log('novo_horario_UTC');
											console.log(novo_horario_UTC);

											var tempo_expiracao = sinal[3];

											if(isNaN(parseInt(tempo_expiracao))){
												tempo_expiracao = parseInt(sinal[3].substring(1));
											}

											if(tempo_expiracao == 1 || tempo_expiracao == 5 || tempo_expiracao == 15 || tempo_expiracao == 30){

												sinaisLimpo.push(
												{

													par:par_sinal,
													dia: dia_sem_horario,
													horario:horario,
													direcao:direcao_sinal,
													tempo_expiracao:tempo_expiracao,


														// par:par_sinal,
														// data:novo_horario_UTC,
														// direcao:direcao_sinal,
														// tempo_expiracao:tempo_expiracao,
														// executada:false,
														// deletado:0,
														// data_cadastro: new Date()
													});




												var par_otc_lista = '';

												var separacao_lista = par_sinal.split('-');

												if(separacao_lista.length>1){
													par_otc_lista = separacao_lista[0] + '_' + separacao_lista[1];
												}else{
													par_otc_lista = separacao_lista;
												}

												array_par_lista.push(par_otc_lista);




											}else{
												arrayContadorErros.push('Na linha ' + contadorLinhas + ' o tempo gráfico não existe!');
											}



										}else{
											arrayContadorErros.push('Na linha ' + contadorLinhas + ' o ano não existe!');
										}
									}else{
										arrayContadorErros.push('Na linha ' + contadorLinhas + ' o mês não existe!');
									}

								}else{
									arrayContadorErros.push('Na linha ' + contadorLinhas + ' o dia não existe!');
								}

							}else{
								arrayContadorErros.push('Na linha ' + contadorLinhas + ' a data está no formato incorreto!');
							}

						}else{
							arrayContadorErros.push('Na linha ' + contadorLinhas + ' não existe a direção!');
						}
					}else{
						arrayContadorErros.push('Na linha ' + contadorLinhas + ' não existe o par!');
					}
				}

			}else{
				if(sinal.length>4){
					arrayContadorErros.push('A linha ' + contadorLinhas + ' está com mais itens que o necessário!');
				}else{
					arrayContadorErros.push('A linha ' + contadorLinhas + ' está faltando informação!');
				}


			}

		}


		if(arrayContadorErros.length == 0){



			data[req.session.usuario.id + '_lista_sinais'] = sinaisLimpo;
			data[req.session.usuario.id + '_lista_sinais_par'] = array_par_lista;


			operadoresModel.find({'numero':operador},function(err,data_operador_e){

				data[req.session.usuario.id + '_operador_escolhido'] = data_operador_e;


				console.log('ggggggggggg data lista_sinais ggggggggggggg');
				console.log(data);
				console.log('gggggggggggggggggggggggggggggggggggggggggggg');

				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'operacional/confirmar_enviar_lista_sinais', data: data, usuario: req.session.usuario});


			});
		}else{

			for(i=0;i<arrayContadorErros.length;i++){
				textoErro = textoErro +  arrayContadorErros[i] + '<br>';
			}
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa arrayContadorErros aaaaaaaaaaaaaaaaa');
			console.log(arrayContadorErros);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

			console.log('textoErro');
			console.log(textoErro);

			res.json({error:'contador_erros',element:elementoErro,texto:textoErro});
		}

	}else{
		res.json({error:'lista_vazia',element:elementoErro,texto:'A lista não pode ser vazia!'});
	}


});


router.post('/popup-confirmacao-remover-sinal/:id/:operador', function(req, res, next) {

	POST = req.body;

	id = req.params.id;

	var operador = req.params.operador;

	console.log('operador:' + operador);

	console.log('@@@@@@@@@@@@@@ estou no pop-up remocao sinal @@@@@@@');
	console.log(id);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	sinalModel.find({'_id':mongoose.Types.ObjectId(id)},function(err,data_sinal_remover){

		console.log('data_sinal_remover');
		console.log(data_sinal_remover);
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');


		var par_otc_remover = '';

		var separacao_remover = data_sinal_remover[0].par.split('-');

		if(separacao_remover.length>1){
			par_otc_remover = separacao_remover[0] + ' (' + separacao_remover[1] + ')';
		}else{
			par_otc_remover = separacao_remover;
		}

		operadoresModel.find({'numero':operador},function(err,data_operador_r){

			data[req.session.usuario.id + '_operador_escolhido_r'] = data_operador_r;


			data[req.session.usuario.id + '_sinal_remover'] = data_sinal_remover;
			data[req.session.usuario.id + '_sinal_remover_horario'] = moment(data_sinal_remover[0].data).utc().format('DD/MM/YYYY HH:mm:ss');
			data[req.session.usuario.id + '_sinal_remover_par'] = par_otc_remover;

			console.log('mmmmmmmmmmmmmmmmmmm data_sinal_remover mmmmmmmmmmmmm');
			console.log(data);
			console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');

			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'operacional/confirmar_remover_sinal', data: data, usuario: req.session.usuario});

		});
	});



});




router.post('/inserir-sinal', function(req, res, next) {
	POST = req.body;

	console.log('______________________ ESTOU NO ENVIAR LISTA ____________________________________');
	console.log(POST);
	console.log('_________________________________________________________________________________');

	console.log(POST.lista);

	var erro_vazio = 0;
	var erro_data = 0;


	array_insercao = [];

	for(i=0; i< POST.lista.par.length; i++){

		if(POST.lista.dia[i] != ''){

			if(POST.lista.horario[i] != ''){

				console.log('POST.lista.dia[i]: ' + POST.lista.dia[i]);
				console.log('POST.lista.horario[i]: ' + POST.lista.horario[i]);


				var hoje = new Date();

				var array_dia = POST.lista.dia[i].split('/');

				var ano;

				if(array_dia[2].length == 2){
					ano = '20' + array_dia[2];
				}else{
					ano = array_dia[2];
				}

				console.log('ano');
				console.log(ano);

				
				array_dia[1] = array_dia[1] - 1;

				var array_horario = POST.lista.horario[i].split(':');

				console.log('array_horario');
				console.log(array_horario);

				console.log('------------------------------------');

				if(array_horario.length < 3){
					array_horario[2] = '00';
				}

				
				/**/
				var dia = new Date(ano,array_dia[1],array_dia[0],array_horario[0],array_horario[1],array_horario[2]);

				console.log('hoje: ' + hoje);
				console.log('dia: ' + dia);
				console.log('======================================================');



				var dia_UTC = new Date(Date.UTC(ano,array_dia[1],array_dia[0],array_horario[0],array_horario[1],array_horario[2]));
				console.log('dia_UTC');
				console.log(dia_UTC);

				array_insercao.push(
				{
					par:POST.lista.par[i],
					data:dia_UTC,
					direcao:POST.lista.direcao[i],
					tempo_expiracao:parseInt(POST.lista.tempo_expiracao[i]),
					executada:false,
					deletado:0,
					operador:POST.lista.operador[i],
					data_cadastro: new Date()
				});


				console.log('sssssssssssssssssssssssssssssssssssssssss');
				console.log(array_insercao);
				console.log('sssssssssssssssssssssssssssssssssssssssss');


			}else{
				erro_vazio++;
			}
		}else{
			erro_vazio++;
		}

	}

	console.log('erro_vazio2:' + erro_vazio);

	if(erro_vazio > 0){
		res.json({error:'campo_vazio',element:'#error_mensagem_sinais',texto:'Existe um ou mais campos vazios nos sinais, por-favor confirmar os valores dos sinais!'});
	}else if(erro_data >0){
		res.json({error:'data_errada',element:'#error_mensagem_sinais',texto:'Algum campo de data está com uma data inferior à hoje!'});
	}else{

		console.log('entrei aqui no final!!!');

		console.log('sssssssssssssssssssssssssssssssssssssssss');
		console.log(array_insercao);
		console.log('sssssssssssssssssssssssssssssssssssssssss');


		sinalModel.insertMany(array_insercao, function(error, docs) {
			res.json(data);
		});

	}

});


router.post('/remover-sinal', function(req, res, next) {
	POST = req.body;



	console.log('@@@@@@@@@@@@@@ estou no remover sinal @@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	sinalModel.findOneAndUpdate({'_id':mongoose.Types.ObjectId(POST.id_sinal)},{'$set':{'deletado':1}},function(err){
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});
	
});






module.exports = router;
