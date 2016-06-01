const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
function spawnBagReader(bagFileName){
  return spawn("./bag/bag",[bagFileName,"/leftcam/image_raw/compressed/","/rightcam/image_raw/compressed/"]);
}
exports.verifyBag = function(bagFileName){
  return new Promise((resolve,reject)=>{
    function inval(msg){ //Unknown bagfile
      throw new Error("Invalid bag file");
    }
    var proc = spawnBagReader(bagFileName); // stdout,stderr
    proc.stdout.on('data',function(msg){
      msg = msg.toString();
      if(msg.substring(0,2)=='OK'){
        if(msg.substring(2)=='0')throw new Error("Invalid topics or no topics");
        resolve(parseInt(msg.substring(2)));
        //this promise return frame count of bag file if verified;
      }
      else inval();
    });
    proc.stderr.on("data",inval);
    proc.on("error",inval);
  });
}

exports.spawnBagReader = spawnBagReader;
