import { readData, writeData } from '~/lib/data';
import { config } from '~/lib/config';

import { isSameDay } from 'date-fns';

import { RESTPostAPIWebhookWithTokenJSONBody as DiscordWebhookData } from 'discord-api-types/rest/v10/webhook';
import { APIEmbed as Embed } from 'discord-api-types/payloads/v10/channel';

const embeds: Embed[] = [];

for (const website of config) {
	let websiteIsUp = false;

	for (let _ = 0; _ < 5; _++) {
		try {
			const response = await fetch(website.url, {
				method: website.uptime?.method ?? 'HEAD',
			});

			websiteIsUp ||= response.ok;
			// eslint-disable-next-line no-empty
		} catch {}

		if (websiteIsUp) break;
	}

	const websiteData = await readData(website);
	if (!websiteData) throw new Error(`Could not fetch data for ${website.name}`);

	const shouldPushNewEntry = !websiteData.lastChecked || !isSameDay(new Date(), websiteData.lastChecked);

	if (websiteIsUp) {
		if (shouldPushNewEntry) {
			websiteData.uptimeHistory.unshift(true);
		} else {
			websiteData.uptimeHistory[0] = true;
		}

		websiteData.uptimeUp += 1;

		if (websiteData.lastCheckedStatus === false) {
			embeds.push({
				title: `${websiteData.name} is back up!`,
				description: 'The website / health check endpoint is reachable again.',
				timestamp: new Date().toISOString(),
				color: 0x4ade80,
			});
		}
	} else {
		if (shouldPushNewEntry) websiteData.uptimeHistory.unshift(false);
		else websiteData.uptimeHistory[0] = false;

		if (websiteData.lastCheckedStatus === true) {
			embeds.push({
				title: `${websiteData.name} is down!`,
				description: 'The website / health check endpoint is unreachable from Olek.',
				timestamp: new Date().toISOString(),
				color: 0xef4444,
			});
		}
	}

	websiteData.uptimeHistory = websiteData.uptimeHistory.slice(0, 30);
	websiteData.uptimeAll += 1;
	websiteData.lastCheckedStatus = websiteIsUp;

	if (shouldPushNewEntry) {
		websiteData.lastChecked = new Date();
	}

	await writeData(website, websiteData);
}

if (process.env.DISCORD_WEBHOOK_URL && embeds.length > 0) {
	const data = { embeds } as DiscordWebhookData;

	if (process.env.DISCORD_WEBHOOK_CONTENT) {
		data.content = process.env.DISCORD_WEBHOOK_CONTENT;
	}

	const discordRes = await fetch(process.env.DISCORD_WEBHOOK_URL, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});

	if (!discordRes.ok) {
		console.warn(`Failed to post to Discord webhook`);
	}
}
