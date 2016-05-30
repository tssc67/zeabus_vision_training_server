GLOBAL.redis = require('./redisClient');
var dataset = require('./dataset');
//Add Bag
dataset.addBag('/home/chiro/w/plink.exe').then(console.log,console.log);
