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
	for (const website of data)
		if (website.data.lastCheckedStatus === false) return false;

	return true;
};

const Index = async () => {
	const data = await fetchData();
	const everythingGood = isEverythingGood(data);

	return (
		<>
			<div className="mb-12 flex flex-col items-center gap-4 md:flex-row md:justify-between">
				<h1 className="text-2xl font-extrabold">Ryan&apos;s Status</h1>

				<a
					href="https://ryanccn.dev/"
					className="text-sm font-medium tracking-tight underline decoration-dashed underline-offset-4"
				>
					ryanccn.dev
				</a>
			</div>

			<div
				className={twMerge(
					'mb-10 flex flex-col items-center justify-center gap-4 text-balance rounded-lg px-6 py-16 text-center text-2xl font-bold text-white md:flex-row',
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

			<ul className="flex flex-col gap-y-4">
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
		title: "Ryan's Status",
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
