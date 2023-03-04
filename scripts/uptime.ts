import { readData, writeData } from '~/lib/data';
import { isSameDay } from 'date-fns';
import config from '@config';

for (const website of config) {
	const tA = performance.now();
	const response = await fetch(website.url, {
		method: website.uptime?.method ?? 'HEAD',
	});
	const tB = performance.now();

	let websiteData = await readData(website);

	websiteData.uptime = websiteData.uptime || {
		history: new Array(30).fill(-1),
		up: 0,
		all: 0,
		lastChecked: null,
	};

	const shouldPushNewEntry =
		!websiteData.uptime.lastChecked ||
		!isSameDay(new Date(), new Date(websiteData.uptime.lastChecked));

	if (response.ok) {
		if (shouldPushNewEntry) websiteData.uptime.history.unshift(tB - tA);
		else websiteData.uptime.history[0] = tB - tA;

		websiteData.uptime.up += 1;
	} else {
		if (shouldPushNewEntry) websiteData.uptime.history.unshift(0);
		else websiteData.uptime.history[0] = 0;
	}

	websiteData.uptime.history = websiteData.uptime.history.slice(0, 30);
	websiteData.uptime.all += 1;

	if (shouldPushNewEntry)
		websiteData.uptime.lastChecked = new Date().toDateString();

	console.log(
		`${website.name} (${website.url}) response ok: ${response.ok}, should push new entry: ${shouldPushNewEntry}`
	);

	await writeData(website, websiteData);
}
