const express = require('express');
const config = require('config');
GLOBAL.redis = require('./redis')
GLOBAL.cfg = config;
var dataset = require('./dataset');
var app = express();

app.listen(cfg.get('web.port'));
