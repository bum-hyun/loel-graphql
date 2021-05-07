const axios = require("axios");
const express = require('express');
const fs = require('fs');
const AdmZip = require("adm-zip");

const router = express.Router();

router.get('/', async (req, res) => {
  const key = "1583ad4dee45b8a0523fd1c12e3bcf58344b950d";
  const result = await axios.get(`https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${key}`, {
    headers: {
      Accept: 'application/zip',
    },
    responseType: 'arraybuffer',
  })
  await fs.writeFileSync("corpCode.zip", result.data);
  const zip = new AdmZip("corpCode.zip");
  const zipEntries = zip.getEntries();
  zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.getData().toString("utf8"));
  });
  // console.log(result.data);
  // res.status(200).json()
});



module.exports = router;
