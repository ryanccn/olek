import { launch } from 'puppeteer';
import lighthouse from 'lighthouse';

import { readData, writeData } from '~/lib/data';

import config from '@config';

(async () => {
	const browser = await launch({ headless: true });
	const page = await browser.newPage();

	for (const website of config) {
		if (website.lighthouse?.enabled === false) continue;
		if (!website.url) continue;

		const results = await lighthouse(website.url, undefined, undefined, page);
		if (!results) throw new Error('No results returned!');

		const scores = results.lhr.categories;

		const websiteData = await readData(website);

		websiteData.lighthouse = {};

		const reportCategories = {
			performance: 'performance',
			accessibility: 'accessibility',
			'best-practices': 'bestPractices',
			seo: 'seo',
		};

		for (const key of Object.keys(reportCategories)) {
			const score = scores[key];
			if (!score || !score.title || !score.score) continue;

			websiteData.lighthouse[reportCategories[key]] = score.score;
		}

		await writeData(website, websiteData);
	}

	await browser.close();
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
