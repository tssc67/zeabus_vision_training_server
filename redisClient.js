const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Redis error : " + err);
});

module.exports = client;