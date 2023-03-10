import { PrismaClient } from '@prisma/client';
// import { readFile, writeFile } from 'node:fs/promises';

import type { ConfigWebsite } from '~/types/config';
import type { WebsiteData } from '~/types/data';

const prisma = new PrismaClient();

export const readData = async (website: ConfigWebsite) => {
	let websiteData: WebsiteData;

	try {
		websiteData = await prisma.websites.findFirstOrThrow({
			where: { url: website.url },
		});
	} catch (e) {
		if (e.code === 'P2025') {
			websiteData = { name: website.name, url: website.url };
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
		await prisma.websites.update({
			where: { url: website.url },
			data: {
				name: data.name,
				url: data.url,
				uptime: data.uptime ?? null,
				lighthouse: data.lighthouse ?? null,
			},
		});
	else await prisma.websites.create({ data });
};
