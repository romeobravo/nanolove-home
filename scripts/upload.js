const dotenv = require('dotenv').config()
const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const mime = require('mime-types')

const uploadDir = function(s3Path, bucketName) {
  let s3 = new AWS.S3()

  function putObject(filePath, stat) {
    let bucketPath = filePath.substring(s3Path.length + 1)
    let params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: fs.readFileSync(filePath),
      ContentType: mime.lookup(filePath),
    }

    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log('Successfully uploaded ' + bucketPath + ' to ' + bucketName)
      }
    })
  }

  function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function(name) {
      var filePath = path.join(currentDirPath, name)
      var stat = fs.statSync(filePath)
      if (stat.isFile()) {
        callback(filePath, stat)
      } else if (stat.isDirectory()) {
        walkSync(filePath, callback)
      }
    })
  }

  walkSync(s3Path, putObject)
}

uploadDir('.build', process.env.BUCKET)
