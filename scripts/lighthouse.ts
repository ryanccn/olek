import lighthouse, { type Flags } from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

import { readData, writeData } from '~/lib/data';
import { config } from '~/lib/config';

(async () => {
	const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
	const lighthouseOptions = {
		logLevel: 'info',
		output: 'html',
		onlyCategories: ['performance'],
		port: chrome.port,
	} satisfies Flags;

	for (const website of config) {
		if (website.lighthouse?.enabled !== true) continue;
		if (!website.url) continue;

		const results = await lighthouse(website.url, lighthouseOptions);
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

	chrome.kill();
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
