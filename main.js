const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const url = require('url');
const parseDataUri = require('parse-data-uri')
GLOBAL.redis = require('./redisClient')
GLOBAL.cfg = config;
var dataset = require('./dataset');
var app = express();

app.listen(cfg.get('web.port'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getframeid',(req,res,next)=>{
  dataset.getNewFrameId().then((frameid)=>{
    res.end(frameid);
  },(err)=>{
    console.log(err);
    res.status(500).end("ERROR");
  });
});

app.get('/img.jpg',(req,res,next)=>{
  res.sendFile(cfg.dataset.tmpDirectory + "/" + req.query.id + ".png",{
    headers:{
      'Cache-Control':"no-cache, no-store, must-revalidate"
    }
  });
});

app.post('/submit',(req,res,next)=>{
  
});

app.use(express.static('./public'));
// require('./dataset.test.js');
