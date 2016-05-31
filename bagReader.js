const spawn = require('child_process').spawn;
function spawnBagReader(bagFileName){
  return spawn("./bag/bag",["/leftcam/image_raw/compressed/","/rightcam/image_raw/compressed/"]);
}
exports.verifyBag = function(bagFileName){
  return new Promise((resolve,reject)=>{
    var proc = spawnBagReader(bagFileName);
    proc.stdout.on('data',console.log);
    proc.stdout.on('close',console.log);
    // return true;
  });
}

exports.spawnBagReader = spawnBagReader;
