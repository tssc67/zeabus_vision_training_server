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
function fileExist(checksum){
  return new Promise((resolve,reject)=>{
    //Count checksum in the set and return both checksum and count as array
    return redis.sismemberAsync('zvts:bags',checksum)
    .then((count)=>{
      return [checksum,count];
    });
  });
}
exports.addBag = function(filename){
  return getHash(filename)
  .then(fileExist)
  .then((checksum_count)=>{
    //If checksum is hit
    if(checksum_count[1]>0)throw new error("File already exist");
    return redis.saddAsync('zvts:bags',checksum_count[0]);
    .then(redis.setAsync(`zvts:bags:${checksum_count[0]}`));
  });
}
