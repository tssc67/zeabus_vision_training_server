var br = require('./bagReader');
br.verifyBag("data/baggy.bag").then(console.log,console.log);
