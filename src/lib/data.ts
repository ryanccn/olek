import slugify from '@sindresorhus/slugify';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ConfigWebsite } from '~/types/config';
import type { WebsiteData } from '~/types/data';

const dataPath = (w: ConfigWebsite) =>
	join(
		process.cwd(),
		process.env.NODE_ENV === 'production' ? 'data' : 'dev-data',
		`${slugify(w.name)}.json`
	);

export const readData = async (website: ConfigWebsite) => {
	let websiteData: WebsiteData;

	try {
		websiteData = (await readFile(dataPath(website), {
			encoding: 'utf-8',
		}).then((t) => JSON.parse(t))) as WebsiteData;
	} catch (e) {
		if (e instanceof Error && e.message.includes('ENOENT')) {
			websiteData = { name: website.name, url: website.url };
		} else {
			throw e;
		}
	}

	return websiteData;
};

export const writeData = async (website: ConfigWebsite, data: WebsiteData) => {
	await writeFile(dataPath(website), JSON.stringify(data));
};
