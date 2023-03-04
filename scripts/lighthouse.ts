import { launch } from 'puppeteer';
import lighthouse from 'lighthouse';

import { readData, writeData } from '~/lib/data';

import config from '@config';

const browser = await launch({ headless: true });
const page = await browser.newPage();

for (const website of config) {
	const results = await lighthouse(website.url, undefined, undefined, page);
	if (!results) throw new Error('No results returned!');

	const scores = results.lhr.categories;

	let websiteData = await readData(website);

	websiteData.lighthouse = {};
	for (const key in scores) {
		const score = scores[key];
		if (!score || !score.title || !score.score) continue;

		websiteData.lighthouse[score.title] = score.score;
	}

	await writeData(website, websiteData);
}

await browser.close();
