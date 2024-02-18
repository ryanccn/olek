import prisma from './prisma';

import type { ConfigWebsite } from '~/types/config';
import type { WebsiteData } from '~/types/data';

export const readData = async (website: ConfigWebsite) => {
	let websiteData: WebsiteData;

	try {
		websiteData = await prisma.websites.findFirstOrThrow({
			where: { url: website.url },
		});
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
		if ((error as any).code === 'P2025') {
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
			throw error;
		}
	}

	return websiteData;
};

export const writeData = async (website: ConfigWebsite, data: WebsiteData) => {
	const exists = await prisma.websites.findMany({
		where: { url: website.url },
	});

	await (exists.length > 0
		? prisma.websites.update({ where: { url: website.url }, data })
		: prisma.websites.create({ data }));
};
