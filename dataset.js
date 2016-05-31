const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function getHash(filename){
  return new Promise((resolve,reject)=>{
    var fd = fs.createReadStream(filename);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    fd.on('end', function() {
      hash.end();
      resolve(hash.read()); // the desired sha1sum
    });
    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);
  })
}
function isAlreadyAdded(checksum){
  return redis.sismemberAsync('zvts:bags',checksum)
  .then((count)=>{
    return [checksum,count];
  });
}
function isExist(filename){
  return new Promise((resolve,reject)=>{
    stats = fs.lstatSync(filename);
    if(stats.isDirectory())throw new Error("This is a directory.");
    resolve(filename);
  });
}
function getUntrainedBag(){
  return redis.srandmemberAsync("zvts:bags:untrained");
}
function setCurrentBag(){
  return getUntrainedBag().then(
    (untrainedBag)=>{
      if(untrainedBag==null)throw new Error("EMPTY");

    }
  )
}
function getCurrentBag(){
  return redis.getAsync("zvts:currentBag").then(
    (resp)=>{
      // if(resp==null)
    }
  )
}
exports.addBag = function(filename){
  return isExist(filename)
  .then(getHash)
  .then(isAlreadyAdded)
  .then((checksum_count)=>{
    //If checksum is hit
    if(checksum_count[1]>0)throw new Error("File already exist");
    return redis.saddAsync('zvts:bags',checksum_count[0])
    .then(redis.setAsync(`zvts:bags:${checksum_count[0]}:filename`,filename))
    .then(redis.saddAsync(`zvts:bags:untrained`,{checksum_count[0]}));
  });
}

exports.getFrame = function(){
  return getCurrentBag();
}
