import { readData, writeData } from '~/lib/data';
import { config } from '~/lib/config';

import { isSameDay } from 'date-fns';

import { RESTPostAPIWebhookWithTokenJSONBody as DiscordWebhookData } from 'discord-api-types/rest/v10/webhook';
import { APIEmbed as Embed } from 'discord-api-types/payloads/v10/channel';

(async () => {
	const embeds: Embed[] = [];

	for (const website of config) {
		let websiteIsUp = false;
		let responseTime = -1;

		try {
			const a = performance.now();
			const response = await fetch(website.url, {
				method: website.uptime?.method ?? 'HEAD',
			});
			const b = performance.now();
			responseTime = b - a;

			websiteIsUp = response.ok;
		} catch {
			websiteIsUp = false;
		}

		const websiteData = await readData(website);

		websiteData.uptime = websiteData.uptime || {
			history: new Array(30).fill(-1),
			up: 0,
			all: 0,
			lastChecked: null,
		};

		const shouldPushNewEntry =
			!websiteData.uptime.lastChecked ||
			!isSameDay(new Date(), new Date(websiteData.uptime.lastChecked));

		if (websiteIsUp) {
			if (shouldPushNewEntry) {
				websiteData.uptime.history.unshift(responseTime);
			} else {
				websiteData.uptime.history[0] =
					(responseTime + websiteData.uptime.history[0]) / 2;
			}

			websiteData.uptime.up += 1;

			if (
				process.env.DISCORD_WEBHOOK_URL &&
				websiteData.uptime.lastCheckStatus === false
			) {
				embeds.push({
					title: `${websiteData.name} is back up!`,
					description:
						'The website / health check endpoint is reachable again.',
					timestamp: new Date().toISOString(),
					color: 0x4ade80,
				});
			}
		} else {
			if (shouldPushNewEntry) websiteData.uptime.history.unshift(0);
			else websiteData.uptime.history[0] = 0;

			if (
				process.env.DISCORD_WEBHOOK_URL &&
				websiteData.uptime.lastCheckStatus === true
			) {
				embeds.push({
					title: `${websiteData.name} is down!`,
					description:
						'The website / health check endpoint is unreachable from Olek.',
					timestamp: new Date().toISOString(),
					color: 0xef4444,
				});
			}
		}

		websiteData.uptime.history = websiteData.uptime.history.slice(0, 30);
		websiteData.uptime.all += 1;
		websiteData.uptime.lastCheckStatus = websiteIsUp;

		if (shouldPushNewEntry) {
			websiteData.uptime.lastChecked = new Date().toDateString();
		}

		await writeData(website, websiteData);
	}

	if (embeds.length > 0) {
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
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
