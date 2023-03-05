import Card from '~/components/Card';

import config from '@config';
import { readData } from '~/lib/data';

import type { GetStaticProps, NextPage } from 'next';
import type { WebsiteData } from '~/types/data';

interface Props {
	data: WebsiteData[];
}

const Index: NextPage<Props> = ({ data }) => {
	return (
		<div>
			<h1 className="font-extrabold text-5xl tracking-tight mb-2">Olek</h1>
			<h2 className="font-medium text-xl text-neutral-500 mb-12">
				Status page for Ryan's websites and services.
			</h2>

			<ul className="flex flex-col gap-y-8 mb-12">
				{data.map((website) => (
					<Card data={website} key={website.url} />
				))}
			</ul>
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const data = await Promise.all(config.map((w) => readData(w)));

	return { props: { data }, revalidate: 60 };
};

export default Index;
