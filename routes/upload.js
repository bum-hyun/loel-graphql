const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const sharp = require("sharp");

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
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', upload.single('img'), async (req, res) => {
  const s3 = new AWS.S3();

  const Bucket = req.file.bucket;
  const Key = req.file.key;
  const filename = Key.split("/")[Key.split("/").length - 1];
  const ext = Key.split(".")[Key.split("/").length - 1];
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;

  const s3Object = await s3.getObject({Bucket, Key}).promise();
  const resizedImage = await sharp(s3Object.Body).resize(600).toFormat(requiredFormat).toBuffer();

  try {
    await s3.putObject({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage,
      ContentType: "image"
    }).promise();

    const original = req.file.location.replace("s3.ap-northeast-2.amazonaws.com/", "");
    const url = original.replace(/\/original\//, '/thumb/');
    res.json({ thumb: url, original });
  } catch (e) {
    console.error("catch", error);
  }

});

module.exports = router;
