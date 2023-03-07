import type { NextPage, GetStaticProps } from 'next';

import { useMemo } from 'react';
import clsx from 'clsx';

import Card from '~/components/Card';
import Head from 'next/head';
import { CheckCheck, XCircle } from 'lucide-react';

import config from '@config';
import { readData } from '~/lib/data';
import pLimit from 'p-limit';

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
				<link
					rel="icon"
					href="/icon-light.svg"
					media="(prefers-color-scheme: no-preference)"
				/>
				<link
					rel="icon"
					href="/icon-dark.svg"
					media="(prefers-color-scheme: dark)"
				/>
				<link
					rel="icon"
					href="/icon-light.svg"
					media="(prefers-color-scheme: light)"
				/>
			</Head>

			<h1 className="mb-2 text-5xl font-extrabold tracking-tight">Olek</h1>
			<h2 className="mb-12 text-xl font-medium text-neutral-500 dark:text-neutral-400">
				Status page for Ryan&apos;s websites and services.
			</h2>

			<div
				className={clsx(
					'mb-10 flex flex-col items-center justify-center gap-4 rounded-lg px-4 py-12 text-center text-2xl font-bold text-white lg:flex-row',
					everythingGood ? 'bg-green-500' : 'bg-red-500'
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
				{data.map((website) => (
					<Card data={website} key={website.config.url} />
				))}
			</ul>
		</>
	);
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const lim = pLimit(10);
	const data = await Promise.all(
		config.map((w) => lim(async () => ({ config: w, data: await readData(w) })))
	);

	return { props: { data }, revalidate: 60 };
};

export default Index;
