import lighthouse, { type Flags } from 'lighthouse';
import { launch } from 'chrome-launcher';

import { readData, writeData } from '~/lib/data';
import { config } from '~/lib/config';

const safeObjectKeys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];

const chrome = await launch({ chromeFlags: ['--headless'] });
const lighthouseOptions = {
	logLevel: 'error',
	output: 'html',
	onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
	port: chrome.port,
} satisfies Flags;

for (const website of config) {
	if (website.lighthouse?.enabled !== true) continue;
	if (!website.url) continue;

	const results = await lighthouse(website.url, lighthouseOptions);
	if (!results) throw new Error('No results returned!');

	const scores = results.lhr.categories;

	const websiteData = await readData(website);

	const reportCategories = {
		'performance': 'lighthousePerformance',
		'accessibility': 'lighthouseAccessibility',
		'best-practices': 'lighthouseBestPractices',
		'seo': 'lighthouseSeo',
	} as const;

	for (const key of safeObjectKeys(reportCategories)) {
		const score = scores[key];
		if (!score || !score.title || !score.score) continue;

		websiteData[reportCategories[key]] = score.score;
	}

	await writeData(website, websiteData);
}

chrome.kill();
