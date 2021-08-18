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
  let corpCode = [];
  zipEntries.forEach(function (zipEntry) {
    var xmlToJson = JSON.parse(convert.xml2json(zipEntry.getData().toString("utf8"), {compact: true, spaces: 2}));
    xmlToJson.result.list.map(item => {
      if (item.stock_code._text) {
        corpCode.push({ stock_code: item.stock_code._text, corp_code: item.corp_code._text });
      }
    })
  });
  
  const interval = setInterval(() => {
    if (corpCode.length === 0) {
      clearInterval(interval);
      return;
    }
    const target = corpCode.shift();
    const marketType = ["Y", "K", "N"];
    axios.get(`https://opendart.fss.or.kr/api/company.json?crtfc_key=${key}&corp_code=${target.corp_code}`)
      .then(res => {
        if (marketType.includes(res.data.corp_cls)) {
          CorpCode.findOne({ where: { stock_code: target.stock_code } })
            .then(object => {
              if (object) {
                object.update({ ...target, stock_name: res.data.stock_name, market: res.data.corp_cls })
              } else {
                CorpCode.create({ ...target, stock_name: res.data.stock_name, market: res.data.corp_cls })
              }
            })
        }
      });
  }, 500)
  
});

module.exports = router;
