// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));



const mongoose = require('mongoose');

const usuarioModel = require('../model/usuariosModel.js');

var licencaUser = require('../model/licencaModel.js');

const mensagemUser = require('../model/mensagemModel.js');

const contaModel = require('../model/contaModel.js');

const teste_conexaoModel = require('../model/conexaoTesteModel.js');

router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu']= 4;
	


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



			licencaUser.findOne({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

				mensagemUser.find({'id_usuario':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_mensagem){

					data[req.session.usuario.id + '_mensagem'] = data_mensagem;

					console.log('------------------------------- data mensagem ----------------------');
					console.log(data_mensagem);
					console.log('--------------------------------------------------------------------');

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

					console.log('arrayMensagemData');
					console.log(arrayMensagemData);

					data[req.session.usuario.id + '_mensagem_horario'] = arrayMensagemData;

					if(data_licenca != null){
						data[req.session.usuario.id + '_licenca_user'] = data_licenca;
						/*Calcular quantos dias faltam para a licença expirar*/
						hoje = new Date();
						data_fim = data_licenca.data_fim;
						data_fim.setDate(data_fim.getDate() + 1);
						diferencaData = data_fim - hoje;
						dias_faltantes = Math.floor(diferencaData / (1000 * 60 * 60 * 24)) + 1;
						data[req.session.usuario.id + '_licenca_user_dias'] = dias_faltantes;
					}else{
						data[req.session.usuario.id + '_licenca_user'] = {creditos:0,licenca_user_dias:0,status:1};
						data[req.session.usuario.id + '_licenca_user_dias'] = -1;
					}

					console.log('ddddddddddddddddddddddddddddddd');
					console.log(data);
					console.log('ddddddddddddddddddddddddddddddd');

					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/minha_conta', data: data, usuario: req.session.usuario});
				}).sort({'data_registro':-1}).limit(30);
			});
		}).sort({'data_cadastro':-1});
	}).sort({'data_cadastro':-1});
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





module.exports = router;
