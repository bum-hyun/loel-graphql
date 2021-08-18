const express = require('express');
const xlsx = require("xlsx");

const router = express.Router();

const { CorpData } = require("../database/models");

const years = [2017, 2018, 2019, 2020];
const names = [["매출액", "수익(매출액)", "영업수익"], "매출원가", "판매비와관리비", "영업이익(손실)", "당기순이익(손실)"];
const sales = ["매출액", "수익(매출액)", "영업수익"];

router.get('/', async (req, res) => {
	
	const results = await CorpData.findAll({
		offset: 0,
		limit: 1
	});
	
	const book = xlsx.utils.book_new();
	
	const data = xlsx.utils.aoa_to_sheet([
		["", ...makeYear()],
		...makeRow(JSON.parse(results[0].data))
	]);
	
	const format = "#,##0";
	const cols = [];
	const width = [];
	for (let i = 1; i <= 17; i++) {
		cols.push(i);
		width.push({wpx: 120});
	}
	for (let col of cols) {
		formatColumn(data, col, format)
	}

	data["!cols"] = width;
	res.status(200).json(makeRow(JSON.parse(results[0].data)));
	xlsx.utils.book_append_sheet(book, data, "DATA");
	xlsx.writeFile(book, "test.xlsx");
});

module.exports = router;

const makeYear = () => {
	const range = [2017, 2018, 2019, 2020];
	const month = ["03", "06", "09", "12"];
	
	return range.map(item => {
		return month.map(item2 => {
			return item + item2;
		})
	}).flat();
}

const makeRow = (result) => {
	return names.reduce((acc, cur) => {
		const temp = [];
		
		let tempName = "";
		if (Array.isArray(cur) && (cur.join(",") === sales.join(","))) {
			tempName = "매출액";
		}
		temp.push(tempName ? tempName : cur);
		years.forEach(year => {
			result["개별"][year].forEach((item, index) => {
				if (Array.isArray(cur) && (cur.join(",") === sales.join(","))) {
					sales.forEach(name => {
						if (item.CIS[name]) {
							fourth(temp, index, item.CIS[name]);
						}
					})
				} else {
					if (cur === "판매비와관리비" && item.CIS["연구개발비"]) {
						fourth(temp, index, Number(item.CIS[cur]) + Number(item.CIS["연구개발비"]));
					} else {
						fourth(temp, index, item.CIS[cur]);
					}
				}
			})
		})
		acc.push(temp);
		return acc;
	}, []);
}

const fourth = (array, index, data) => {
	if (index === 3) {
		let result = 0;
		array.slice(-3).forEach(item => result += Number(item));
		array.push(Number(data) - result)
	} else {
		array.push(Number(data))
	}
}

function formatColumn(worksheet, col, fmt) {
	const range = xlsx.utils.decode_range(worksheet['!ref'])
	for (let row = range.s.r + 1; row <= range.e.r; ++row) {
		const ref = xlsx.utils.encode_cell({ r: row, c: col })
		if (worksheet[ref] && worksheet[ref].t === 'n') {
			worksheet[ref].z = fmt
		}
	}
}
