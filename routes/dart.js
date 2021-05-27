const axios = require("axios");
const express = require('express');
const fs = require('fs');
const AdmZip = require("adm-zip");
const convert = require('xml-js');

const router = express.Router();

const { CorpCode } = require("../database/models");

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
  fs.unlinkSync("corpCode.zip");
  const zipEntries = zip.getEntries();
  const corpCode = [];
  zipEntries.forEach(function (zipEntry) {
    var xmlToJson = JSON.parse(convert.xml2json(zipEntry.getData().toString("utf8"), {compact: true, spaces: 2}));
    xmlToJson.result.list.map(item => {
      if (item.stock_code._text) {
        corpCode.push({ stock_code: item.stock_code._text, name: item.corp_name._text, corp_code: item.corp_code._text });
      }
    })
  });
  
  const marketType = ["Y", "K", "N"];
  for (const item of corpCode.slice(0, 1)) {
    const details = await axios.get(`https://opendart.fss.or.kr/api/company.xml?crtfc_key=${key}&corp_code=${item}`);
    if (marketType.includes(details.data.corp_cls)) {
      console.log(item);
      CorpCode.create({ ...item, market: details.data.corp_cls })
    }
  }
});



module.exports = router;
