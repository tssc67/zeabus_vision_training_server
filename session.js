const session = require('express-session');
const cfg = require('config');
const uuid = require('uuid');
var RedisStore = require('connect-redis')(session);
var options = cfg.get("session");
module.exports = session({
  genid: uuid.v4,
  resave: false,
  saveUninitialized: true,
  secret: options.secret,
  store: new RedisStore()
})
