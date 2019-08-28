const AWS = require('aws-sdk');
require('dotenv').config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
const SIGNATURE_VERSION = process.env.SIGNATURE_VERSION;
const REGION = process.env.REGION;

const s3 = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  signatureVersion: SIGNATURE_VERSION,
  region: REGION,
});
const options = {
  Bucket: BUCKET_NAME,
};

function getFiles(req, res) {
  s3.listObjects(options)
    .promise()
    .then(data => {
      return res.render ('index', { files: data.Contents });
    })
    .catch(error => {
      return res.render ('error', { error });
    });
}

function getFile(req, res) {
  const filename = req.params.filename;
  const params = { Bucket: options.Bucket, Key: filename };
  s3.getSignedUrl ('getObject', params, (error, url) => {
    if (error) return res.render ('error', { error });
    return res.render ('file', {data: { filename, url }});
  });
}

function uploadFile (req, res) {
  if (req.method === 'GET') return res.render ('upload');
  if (req.method === 'POST') {
    if (!req.files) {
      return res.render('error', { error: {message: 'No file uploaded' }});
    }
    const { name, data } = req.files.file;
    const params = { Bucket: options.Bucket, Key: name, Body: data };
    s3.upload(params, (error, data) => {
      if(error) return res.render('error', { error });
      return res.redirect('/');
    });
  }
}

function deleteFile(req, res) {
  console.log(req.params.filename);
  const params = { Bucket: options.Bucket, Key: req.params.filename };
   s3.deleteObject(params, function(error, data) {
     if (error) {
       return res.render('error', { error });
     }
     return res.redirect('/');
   });
}

module.exports = {
  uploadFile,
  deleteFile,
  getFiles,
  getFile,
};
