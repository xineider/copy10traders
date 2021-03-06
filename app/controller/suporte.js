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


router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data.numero_menu = 4;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'suporte/ajuda', data: data, usuario: req.session.usuario});
});






module.exports = router;
