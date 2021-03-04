const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'images.loelblog.com',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
    },
    
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', upload.single('img'), (req, res) => {
  const originalUrl = req.file.location.replace("s3.ap-northeast-2.amazonaws.com/", "");
  const url = originalUrl.replace(/\/original\//, '/thumb/');
  res.json({ url, originalUrl });
});


module.exports = router;
