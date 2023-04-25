import { defineConfig } from '~/types/config';

export default defineConfig([
	{ name: 'Website', url: 'https://ryanccn.dev/' },
	{ name: 'Moddermore', url: 'https://moddermore.net/' },
	{
		name: 'Miniflux',
		url: 'https://miniflux.ryanccn.dev/',
		uptime: { method: 'GET' },
	},
	{ name: 'SearXNG', url: 'https://searxng.ryanccn.dev/' },
	{
		name: 'Blåhaj',
		url: 'https://blahaj.ryanccn.dev/health',
		lighthouse: { enabled: false },
	},
	{
		name: 'Mojang Authserver',
		url: 'https://authserver.mojang.com/',
		lighthouse: { enabled: false },
	},
]);
