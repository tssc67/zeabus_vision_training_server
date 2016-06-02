const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const uuid = require('uuid');
var cacheFile;
var cacheProc;
var curFrame=0;
function spawnBagReader(bagFileName){
  curFrame=0;
  cacheFile = bagFileName;
  return cacheProc=spawn("./bag/bag",[bagFileName,"/leftcam/image_raw/compressed/","/rightcam/image_raw/compressed/"]);
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

exports.getBagFrame = function(fileName,nthFrame){
  if(fileName != cacheFile || curFrame > nthFrame){
    spawnBagReader(fileName);
  }
  while(curFrame!=nthFrame){
    cacheProc.stdin.write("NEXT\n");
    curFrame++;
  }
  return new Promise((resolve,reject)=>{
    var saveFileName = (`${cfg.get('dataset.tmpDirectory')}/${uuid.v4()}.png`);
    cacheProc.stdin.write(`SAVE ${saveFileName}\n`);
    resolve(saveFileName);
  })
};
