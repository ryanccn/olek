import { type Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { twMerge } from 'tailwind-merge';
import { CheckCheck, XCircle } from 'lucide-react';
import Card from '~/components/Card';

import PQueue from 'p-queue';
import { config } from '~/lib/config';
import { readData } from '~/lib/data';

import { ConfigWebsite } from '~/types/config';
import { WebsiteData } from '~/types/data';

type DataType = { config: ConfigWebsite; data: WebsiteData }[];

const fetchData = unstable_cache(
	async () => {
		const queue = new PQueue({ concurrency: 10 });

		const data = (await Promise.all(
			config.map((w) =>
				queue.add(async () => ({
					config: w,
					data: await readData(w),
				})),
			),
		)) as DataType;

		return data;
	},
	['status-data'],
	{ revalidate: 60 },
);

const isEverythingGood = (data: DataType) => {
	for (const website of data) {
		if (
			website &&
			website.data.uptime &&
			website.data.uptime.history[0] === 0
		) {
			return false;
		}
	}

	return true;
};

const Index = async () => {
	const data = await fetchData();
	const everythingGood = isEverythingGood(data);

	return (
		<>
			<h1 className="mb-2 text-5xl font-extrabold tracking-tight">Olek</h1>
			<h2 className="mb-12 text-xl font-medium text-neutral-500 dark:text-neutral-400">
				Status page for Ryan&apos;s websites and services.
			</h2>

			<div
				className={twMerge(
					'mb-10 flex flex-col items-center justify-center gap-4 rounded-lg px-4 py-12 text-center text-2xl font-bold text-white lg:flex-row',
					everythingGood ? 'bg-green-500' : 'bg-red-500',
				)}
			>
				{everythingGood ? (
					<CheckCheck className="block h-6 w-6 stroke-[2.5]" />
				) : (
					<XCircle className="block h-6 w-6 stroke-[2.5]" />
				)}
				<span>
					{everythingGood
						? 'All services are online'
						: 'Some services are down'}
				</span>
			</div>

			<ul className="mb-12 flex flex-col gap-y-8">
				{data.map((website) =>
					website ? <Card data={website} key={website.config.url} /> : null,
				)}
			</ul>
		</>
	);
};

const generateMetadata = async (): Promise<Metadata> => {
	const data = await fetchData();
	const everythingGood = isEverythingGood(data);

	return {
		title: 'Olek',
		description: "Status page for Ryan's websites and services",
		metadataBase: new URL('https://status.ryanccn.dev/'),

		icons: [
			{
				url: '/icon-light.svg',
				media: '(prefers-color-scheme: no-preference)',
			},
			{
				url: '/icon-light.svg',
				media: '(prefers-color-scheme: light)',
			},
			{
				url: '/icon-dark.svg',
				media: '(prefers-color-scheme: dark)',
			},
		],

		openGraph: {
			type: 'website',
			images: `https://status.ryanccn.dev/cover-${everythingGood ? 'good' : 'bad'}.png`,
		},

		twitter: {
			card: 'summary_large_image',
			images: `https://status.ryanccn.dev/cover-${everythingGood ? 'good' : 'bad'}.png`,
		},
	};
};

export default Index;
export { generateMetadata };
