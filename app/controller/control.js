'use strict';
var crypto = require('crypto');
var nodemailer = require('nodemailer');

class Control {
	// Retorne o parametro encriptado;
	Encrypt(str) {
		return crypto.createHash('sha256').update('7841415206102ace4512412c019481ca'+str+'1084500784512ae4870512e840102bbc').digest("hex");
	}
	Unserialize(data) {
		var array = [];
		data = data.split('&');
		for (var i = data.length - 1; i >= 0; i--) {
			var array_pre = [];
			array_pre = data[i].split('=');
			array[array_pre[0]] = array_pre[1];
		}
		return array;
	}
	Isset(data, tipo) {
		if (tipo == false) {
			if (data == undefined || data == 'undefined') {
				return true;
			} else {
				return false;
			}
		} else {
			if (data == undefined || data == 'undefined') {
				return false;
			} else {
				return true;
			}
		}
	}

	DateTime() {

		var date = new Date();

		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;

		var min  = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;

		var sec  = date.getSeconds();
		sec = (sec < 10 ? "0" : "") + sec;

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getDate();
		day = (day < 10 ? "0" : "") + day;

		return day + "/" + month + "/" + year + " " +  hour + ":" + min + ":" + sec;

	}
	DateTimeForFile() {

		var date = new Date();

		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;

		var min  = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;

		var sec  = date.getSeconds();
		sec = (sec < 10 ? "0" : "") + sec;

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getDate();
		day = (day < 10 ? "0" : "") + day;

		var mili = date.getMilliseconds();

		return day + "_" + month + "_" + year + "_" +  hour + "_" + min + "_" + sec + "_" + mili;

	}


	SendMail(para, assunto,text, html) {

		

		var randomico = Math.floor(Math.random() * 16); 
		console.log('randomico: ' + randomico);

		if(randomico == 0){
			var usuario = 'naoresponda01@copy10traderglobal.com.br';
			var senha = '@Emailsuporte01';			
		}else if(randomico == 1){
			var usuario = 'naoresponda02@copy10traderglobal.com.br';
			var senha = '@Emailsuporte02';
		}else if(randomico == 2){
			var usuario = 'naoresponda03@copy10traderglobal.com.br';
			var senha = '@Emailsuporte03';
		}else if(randomico == 3){
			var usuario = 'naoresponda04@copy10traderglobal.com.br';
			var senha = '@Emailsuporte04';
		}else if(randomico == 4){
			var usuario = 'naoresponda05@copy10traderglobal.com.br';
			var senha = '@Emailsuporte05';
		}else if(randomico == 5){
			var usuario = 'naoresponda06@copy10traderglobal.com.br';
			var senha = '@Emailsuporte06';
		}else if(randomico == 6){
			var usuario = 'naoresponda07@copy10traderglobal.com.br';
			var senha = '@Emailsuporte07';
		}else if(randomico == 7){
			var usuario = 'naoresponda08@copy10traderglobal.com.br';
			var senha = '@Emailsuporte08';
		}else if(randomico == 8){
			var usuario = 'naoresponda09@copy10traderglobal.com.br';
			var senha = '@Emailsuporte09';
		}else if(randomico == 9){
			var usuario = 'naoresponda10@copy10traderglobal.com.br';
			var senha = '@Emailsuporte10';
		}else if(randomico == 10){
			var usuario = 'naoresponda11@copy10traderglobal.com.br';
			var senha = '@Emailsuporte11';
		}else if(randomico == 11){
			var usuario = 'naoresponda12@copy10traderglobal.com.br';
			var senha = '@Emailsuporte12';
		}else if(randomico == 12){
			var usuario = 'naoresponda13@copy10traderglobal.com.br';
			var senha = '@Emailsuporte13';
		}else if(randomico == 13){
			var usuario = 'naoresponda14@copy10traderglobal.com.br';
			var senha = '@Emailsuporte14';
		}else{
			var usuario = 'naoresponda15@copy10traderglobal.com.br';
			var senha = '@Emailsuporte15';
		}

		let transporter = nodemailer.createTransport({
			name: 'mail.copy10traderglobal.com.br',
			host:'mail.copy10traderglobal.com.br',
			secureConnection: true,
			port: 465,
			auth: {
				user: usuario,
				pass: senha,
			},
			tls: {
				rejectUnauthorized:false
			}
			// host: 'smtp-mail.outlook.com',
			// secureConnection: false,
			// port: 587,						
			// auth: {
			// 	user: 'naoresponda_copymoneycanga2@hotmail.com',
			// 	pass: 'senha_C4ng4_M1n8227'
			// },
			// tls: {
			// 	ciphers:'SSLv3'
			// }
		});

		// let transporter = nodemailer.createTransport({
		// 	host: 'smtp-mail.outlook.com',			
		// 	secure: false,
		// 	port: 587,						
		// 	auth: {
		// 		user: usuario,
		// 		pass: senha
		// 	},  tls: {
		// 		ciphers:'SSLv3'
		// 	}
		// });


		let mailOptions = {
			from: '"Copy 10 Traders - Não Responda" <' +usuario +'>',
			to: para, 
			subject: assunto, 
			text: text, 
			html: html 
		};



		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);

		});

		transporter.close();

	}

	SendMailAttachment(para, assunto,text, html,nomeAnexo,caminhoAnexo) {
		nodemailer.createTestAccount((err, account) => {

					// create reusable transporter object using the default SMTP transport
					let transporter = nodemailer.createTransport({
						host: 'mail.elitetradersoficial.com.br',
						secureConnection: false,
						port: 587,						
						auth: {
							user: 'naoresponda@elitetradersoficial.com.br',
							pass: 'MPav7HlgoMag'
						}, tls: {
							rejectUnauthorized:false
						}
					});

					// setup email data with unicode symbols
					let mailOptions = {
							from: '"Elite Bank - Não Responda" <naoresponda@elitetradersoficial.com.br>', // sender address
							to: para, // list of receivers
							subject: assunto, // Subject line
							text: text, 
							html: html,
							attachments: [
							{
								filename: nomeAnexo,
								path:caminhoAnexo
							}				
							] // html body
						};


					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
							// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
							// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
						});
				});
	}
}
module.exports = Control;