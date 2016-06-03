const fs = require('fs');
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const parseDataUri = require('parse-data-uri')
GLOBAL.redis = require('./redisClient')
GLOBAL.cfg = config;
var dataset = require('./dataset');
var app = express();

app.listen(cfg.get('web.port'));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./session'));
app.use(require('./login'));


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
  var imgData;
  try{
    imgData = parseDataUri(req.body.img);
  }catch(e){
    return res.status(500).end("ERROR");
  }
  fs.writeFile(`${cfg.get('dataset.labelDirectory')}/${req.body.id}.png`,imgData.data,(err)=>{
    if(err)return res.status(500).end("ERROR");
    dataset.submit(req.body.id).then(()=>{
      res.end("OK");
    })
  })
});

app.use(express.static(cfg.get('web.public')));
// require('./dataset.test.js');
