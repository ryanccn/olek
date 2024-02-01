import prisma from './prisma';

import type { ConfigWebsite } from '~/types/config';
import type { WebsiteData } from '~/types/data';

export const readData = async (website: ConfigWebsite) => {
	let websiteData: WebsiteData;

	try {
		websiteData = await prisma.websites.findFirstOrThrow({
			where: { url: website.url },
		});
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((e as any).code === 'P2025') {
			websiteData = {
				name: website.name,
				url: website.url,
				uptimeUp: 0,
				uptimeAll: 0,
				uptimeHistory: [],
				lastChecked: null,
				lastCheckedStatus: null,
				lighthousePerformance: null,
				lighthouseAccessibility: null,
				lighthouseBestPractices: null,
				lighthouseSeo: null,
			};
		} else {
			throw e;
		}
	}

	return websiteData;
};

export const writeData = async (website: ConfigWebsite, data: WebsiteData) => {
	const exists = await prisma.websites.findMany({
		where: { url: website.url },
	});

	if (exists.length > 0)
		await prisma.websites.update({ where: { url: website.url }, data });
	else await prisma.websites.create({ data });
};
