GLOBAL.redis = require('./redisClient');
var dataset = require('./dataset');
//Add Bag
// dataset.addBag('/home/chiro/w/zeabus_vision_training_server/data/baggy.bag').then(console.log,console.log);
dataset.getFrame().then(console.log,console.log);
