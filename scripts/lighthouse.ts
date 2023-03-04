import { launch, type PuppeteerLaunchOptions } from 'puppeteer-core';
import lighthouse from 'lighthouse';

import { readData, writeData } from '~/lib/data';

import config from '@config';

let options: PuppeteerLaunchOptions;

if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
	const { default: chromeAwsLambda } = await import('chrome-aws-lambda');
	options = {
		executablePath: await chromeAwsLambda.executablePath,
		headless: chromeAwsLambda.headless,
		defaultViewport: chromeAwsLambda.defaultViewport,
		args: chromeAwsLambda.args,
	};
} else {
	if (!process.env.CHROMIUM_PATH)
		throw new Error('No CHROMIUM_PATH defined in environment!');
	options = { executablePath: process.env.CHROMIUM_PATH, headless: false };
}

const browser = await launch(options);
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
