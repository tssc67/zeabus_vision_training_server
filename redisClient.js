const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
var client = redis.createClient();
var sub = redis.createClient();
client.on("error", function (err) {
    console.log("Redis error : " + err);
});
client.exsub = redis.createClient();
client.exsub.psubscribe("__key*__:*");
module.exports = client;
