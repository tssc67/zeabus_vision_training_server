GLOBAL.redis = require('./redisClient');
GLOBAL.cfg = require('config');
var dataset = require('./dataset');
//Add Bag
dataset.addBag('/home/chiro/w/zeabus_vision_training_server/data/baggy.bag').then(console.log,console.log);
// dataset.getFrame().then((d)=>{
//   console.log("Resolve with " + d)
// },(d)=>{
//   console.log("Reject with " + d);
// });
