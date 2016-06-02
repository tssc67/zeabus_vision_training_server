const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
var bagReader = require('./bagReader');

function getHash(filename){
  return new Promise((resolve,reject)=>{
    var fd = fs.createReadStream(filename);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    fd.on('end', function() {
      hash.end();
      resolve(hash.read()); // the desired checksum
    });
    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);
  })
}

function getFileName(bagHash){
  return redis.getAsync(`zvts:bags:${bagHash}:filename`);
}

function isAlreadyAdded(checksum){
  return redis.sismemberAsync('zvts:bags',checksum)
  .then((count)=>{
    // return both hash and it existence
    return [checksum,count];
  });
}

function isExist(filename){
  return new Promise((resolve,reject)=>{
    // To check whether it is exist and not a dir
    stats = fs.lstatSync(filename);
    if(stats.isDirectory())throw new Error("This is a directory.");
    resolve(filename);
  });
}

function getUntrainedBag(){
  return redis.srandmemberAsync("zvts:bags:untrained").then(
    (bagHash)=>{
      //Randomly select hash of bag that was not trained yet
      if(bagHash==null)throw new Error("EMPTY");
      return bagHash;
    }
  );
}

function getUntrainedFrame(){
  return redis.srandmemberAsync("zvts:frames:untrained");
}

function setCurrentBag(bagHash){
  return redis.setAsync("zvts:currentBag",bagHash).then(()=>{
    return bagHash;
  });
}

function getCurrentBag(){
  return redis.getAsync("zvts:currentBag").then(
    (resp)=>{
      return (resp==null)
        ?getUntrainedBag().then(setCurrentBag)
        :resp
    }
  );
}

function getBagSize(bagHash){
  return redis.getAsync(`zvts:bags:${bagHash}:size`).then((size)=>{
    return parseInt(size);
  })
}

function getBagFrame(bagHash,progress){
  return getFileName(bagHash).then((bagFileName)=>{
    return bagReader.getBagFrame(bagFileName,progress[1]);
  });
}

function registerFrame(fileName){
  return redis.setAsync(
    `zvts:frames:locker:${fileName}`,
    1,
    'EX',
    cfg.get('dataset.expiredTime')
  )
  .then(redis.sremAsync('zvts:frames:untrained',fileName))
  .then(()=>{return fileName});
}

function increaseBagProgress(bagHash){
  return isAlreadyAdded(bagHash).then((checksum_count)=>{
    if(checksum_count[1] == 0)throw new Error("Bag doesn't exist");
    return redis.incrAsync(`zvts:bags:${bagHash}:progress`)
    //
  })
}

function getBagProgress(bagHash){
  return redis.getAsync(`zvts:bags:${bagHash}:progress`).then((resp)=>{
    if(resp==null)throw new Error("Bag doesn't exist");
    return parseInt(resp);
  })
}

function isFinished(bagHash){
  return getBagProgress(bagHash).then((progress)=>{
    progress = parseInt(progress);
    return getBagSize(bagHash).then((size)=>{
      return [(progress == size),progress,size];
    });
  });
}

function getNewFrame(){
  // HACK: HVCK ALERT
  var currentBag;
  var progress;
  // HACK: MUCH HAPPEN, HVCK END
  return getCurrentBag()
  .then((bagHash)=>{
    currentBag = bagHash;
    return isFinished(bagHash)
  })
  .then((_progress)=>{
    if(!_progress[0]){//if not finished
      progress = _progress;
      return currentBag;
    }
    else{
      progress = 0;
      return redis.sremAsync(`zvts:bags:untrained`,currentBag)
      .then(redis.delAsync("zvts:currentBag")).then(getCurrentBag);
    }
  })
  .then((bagHash)=>{
    currentBag = bagHash;
    return increaseBagProgress(bagHash)
    .then(()=>{
      return getFileName(bagHash);
    });
  })
  .then((bagFileName)=>{
    return bagReader.getBagFrame(currentBag,bagFileName,progress[1]);
  });
}

redis.exsub.on('pmessage',(p,c,key)=>{
  var fileName = key.split(":")[3];
  redis.saddAsync("zvts:frames:untrained",fileName);
});

exports.addBag = function(filename){
  var checksum_count;
  return isExist(filename)
  .then(getHash)
  .then(isAlreadyAdded)
  .then((checksum_count_)=>{
    //throw if checksum is hit : File already acknowledge
    if(checksum_count_[1]>0)throw new Error("File already exist");
    checksum_count = checksum_count_;
    return filename;
  })
  .then(bagReader.verifyBag)
  .then((size)=>{
    //if bag is verified frame count should be return
    //then add this bag to redis

    return redis.saddAsync('zvts:bags',checksum_count[0])
    .then(redis.setAsync(`zvts:bags:${checksum_count[0]}:filename`,filename))
    .then(redis.setAsync(`zvts:bags:${checksum_count[0]}:size`,size))
    .then(redis.setAsync(`zvts:bags:${checksum_count[0]}:progress`,0))
    .then(redis.saddAsync(`zvts:bags:untrained`,checksum_count[0]));
  });
}

exports.getNewFrameId = function(){
  // HACK: promise hacking don't do this
  var currentBag;
  var progress;
  return getUntrainedFrame().then((frameId)=>{
    return frameId == null
      ?getNewFrame()
      :frameId;
  }).then(registerFrame);
  //need revamp
}

exports.submit = function(frameId){
  return redis.sremAsync('zvts:frames:untrained',frameId);
}
