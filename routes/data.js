const axios = require("axios");
const express = require('express');

const router = express.Router();

const { CorpCode, CorpData } = require("../database/models");
const key = "1583ad4dee45b8a0523fd1c12e3bcf58344b950d";
const url = "https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json";
const years = [2017, 2018, 2019, 2020];
const reports = [11013, 11012, 11014, 11011];

router.get('/', async (req, res) => {
	const corps = await CorpCode.findAll({
		offset: 311,
		limit: 250
	});
	
	let params = {
		crtfc_key: key,
		bsns_year: 2017,
	};
	
	const DATA = {};
	const cfsResult = [];
	const ofsResult = [];
	
	const interval = setInterval(async () => {
		const corp = corps.shift();
		params = {...params, corp_code: `00${corp.corp_code}`}
		years.forEach(year => {
			params = {...params, bsns_year: year};
			reports.forEach(report => {
				params = {...params, reprt_code: report};
				cfsResult.push(axios.get(url, { params: { ...params, fs_div: "CFS" } }));
				ofsResult.push(axios.get(url, { params: { ...params, fs_div: "OFS" } }));
			})
		})

		const cfs = await Promise.all(cfsResult);
		const ofs = await Promise.all(ofsResult)

		DATA["연결"] = makeObject(cfs);
		DATA["개별"] = makeObject(ofs);
		
		CorpData.findOne({ where: { corp_code: corp.corp_code } })
			.then(object => {
				if (object) {
					object.update({ corp_code: corp.corp_code, stock_code: corp.stock_code, stock_name: corp.stock_name, data: JSON.stringify(DATA) })
				} else {
					CorpData.create({ corp_code: corp.corp_code, stock_code: corp.stock_code, stock_name: corp.stock_name, data: JSON.stringify(DATA) })
				}
			})
		if (corps.length === 0) {
			clearInterval(interval);
		}
	}, 2000);
	
});

module.exports = router;

const makeObject = (data) => {
	return sortData(data.map((item, index) => {
		if (item.data.list) {
			return item.data.list.filter(item => item.sj_div !== "SCE")
				.reduce((acc, cur) => {
					acc[cur.sj_div] = {...acc[cur.sj_div], [cur.account_nm]: cur.thstrm_amount };
					return acc;
				}, {});
		} else {
			return null;
		}
	}))
}

const sortData = (data) => {
	let count = 0;
	let year = 2017;
	return data.reduce((acc, cur) => {
		if (count > 3) {
			count = 0;
			year++;
		}
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(cur);
		count++;
		return acc;
	}, {})
}
