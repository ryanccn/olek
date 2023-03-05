import type { NextPage, GetStaticProps } from 'next';

import { useMemo } from 'react';
import clsx from 'clsx';

import Card from '~/components/Card';
import Head from 'next/head';
import { CheckCheck, XCircle } from 'lucide-react';

import config from '@config';
import { readData } from '~/lib/data';

import type { WebsiteData } from '~/types/data';
import type { ConfigWebsite } from '~/types/config';

interface Props {
	data: { config: ConfigWebsite; data: WebsiteData }[];
}

const Index: NextPage<Props> = ({ data }) => {
	const everythingGood = useMemo(() => {
		let ret = true;

		for (const website of data) {
			if (website.data.uptime && website.data.uptime.history[0] === 0) {
				ret = false;
				break;
			}
		}

		return ret;
	}, [data]);

	return (
		<>
			<Head>
				<title>Olek</title>
			</Head>

			<h1 className="font-extrabold text-5xl tracking-tight mb-2">Olek</h1>
			<h2 className="font-medium text-xl text-neutral-500 dark:text-neutral-400 mb-12">
				Status page for Ryan&apos;s websites and services.
			</h2>

			<div
				className={clsx(
					'flex items-center justify-center gap-x-4 px-3 py-10 text-white font-bold text-2xl mb-10 rounded-lg',
					everythingGood ? 'bg-green-500' : 'bg-red-500'
				)}
			>
				{everythingGood ? (
					<CheckCheck className="block w-6 h-6 stroke-[2.5]" />
				) : (
					<XCircle className="block w-6 h-6 stroke-[2.5]" />
				)}
				<span>
					{everythingGood
						? 'All services are online'
						: 'Some services are down'}
				</span>
			</div>

			<ul className="flex flex-col gap-y-8 mb-12">
				{data.map((website) => (
					<Card data={website} key={website.config.url} />
				))}
			</ul>
		</>
	);
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const data = await Promise.all(
		config.map(async (w) => ({ config: w, data: await readData(w) }))
	);

	return { props: { data }, revalidate: 60 };
};

export default Index;
