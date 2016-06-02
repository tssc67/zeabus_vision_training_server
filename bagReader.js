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
    function initialListener(msg){
      msg = msg.toString();
      if(msg.substring(0,2)=='OK'){
        if(msg.substring(2)=='0')throw new Error("Invalid topics or no topics");
        return resolve(parseInt(msg.substring(2)));
        //this promise return frame count of bag file if verified;
      }
      else inval();
    }
    proc.stdout.once('data',initialListener);
    proc.stderr.once("data",inval);
    proc.on("error",inval);
  });
}

function getFrameFromProcess(fileId,fileName,nthFrame){
  while(curFrame!=nthFrame){
    cacheProc.stdin.write("NEXT\n");
    curFrame++;
  }
  return new Promise((resolve,reject)=>{
    var saveFileName = (`${cfg.get('dataset.tmpDirectory')}/${fileId}.${nthFrame}.png`);

    cacheProc.stdin.write(`SAVE ${saveFileName}\n`);
    // cacheProc.stdin.write(`SHOW\n`);
    function waitOK(msg){
      resolve(`${fileId}.${nthFrame}`);
    }
    cacheProc.stdout.once('data',waitOK);
  });
}

exports.getBagFrame = function(fileId,fileName,nthFrame){
  if(fileName != cacheFile || curFrame > nthFrame){
    spawnBagReader(fileName);
    return new Promise((resolve,reject)=>{
      cacheProc.stdout.once("data",(msg)=>{
        getFrameFromProcess(fileId,fileName,nthFrame).then(resolve,reject);
      });
    })
  }
  else return getFrameFromProcess(fileId,fileName,nthFrame);
};
