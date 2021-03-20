const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const sharp = require("sharp");

const router = express.Router();

const devDir = { thumb: "test-thumb", contents: "test-contents", original: "test-original" };
const prodDir = { thumb: "thumb", contents: "contents", original: "original" };


const arrayForSize = [
  { size: 600, dir: process.env.NODE_ENV === "production" ? prodDir.thumb : devDir.thumb },
  { size: 1200, dir: process.env.NODE_ENV === "production" ? prodDir.contents : devDir.contents }
];

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
      cb(null, `${process.env.NODE_ENV === "production" ? prodDir.original : devDir.original}/${Date.now()}-${path.basename(file.originalname)}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', upload.array('images', 20), async (req, res) => {
  const results = await Promise.all(req.files.map(async (file) => {
    const s3 = new AWS.S3();
    const Bucket = file.bucket;
    const Key = file.key;
    const filename = Key.split("/")[Key.split("/").length - 1];
    const ext = Key.split(".")[Key.split("/").length - 1];
    const requiredFormat = ext === "jpg" ? "jpeg" : ext;

    const s3Object = await s3.getObject({Bucket, Key}).promise();

    for (const item of arrayForSize) {
      const resizedImage = await sharp(s3Object.Body).resize(item.size).toFormat(requiredFormat).toBuffer();

      try {
        await s3.putObject({
          Bucket,
          Key: `${item.dir}/${filename}`,
          Body: resizedImage,
          ContentType: "image"
        }).promise();
      } catch (e) {
        console.error("catch", e);
      }
    }

    const original = file.location.replace("s3.ap-northeast-2.amazonaws.com/", "");
    const thumb = original.replace(/original\//, `thumb/`);
    const contents = original.replace(/original\//, `contents/`);
    return { thumb, original, contents }
  }));
  res.json(results);
});

module.exports = router;
