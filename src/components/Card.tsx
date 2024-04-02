'use client';

import type { WebsiteData } from '~/types/data';
import type { ConfigWebsite } from '~/types/config';

import { twMerge } from 'tailwind-merge';
import { CheckCircleIcon, ShieldQuestionIcon, XCircleIcon } from 'lucide-react';

const readableLighthouseTitle = {
	performance: 'Performance',
	accessibility: 'Accessibility',
	bestPractices: 'Best Practices',
	seo: 'SEO',
};

const padArrayStart = <T,>(arr: T[], len: number, fill: T): T[] => {
	return [...Array.from<T>({ length: len }).fill(fill), ...arr].slice(-Math.max(len, arr.length));
};

const Card = ({ data }: { data: { config: ConfigWebsite; data: WebsiteData } }) => {
	return (
		<>
			<li>
				<div className="flex flex-col items-start rounded-lg bg-neutral-50 p-8 dark:bg-neutral-900">
					<div className="mb-4 flex w-full flex-row items-center justify-between gap-x-2">
						<div className="flex flex-row items-center gap-x-2">
							{data.config.public === true ? (
								<a
									href={data.config.url}
									className="text-xl font-bold tracking-tight underline decoration-black/50 decoration-dashed underline-offset-4 transition-colors hover:decoration-black/75 dark:decoration-white/50 dark:hover:decoration-white/75"
								>
									{data.config.name}
								</a>
							) : (
								<span className="text-xl font-bold tracking-tight">{data.config.name}</span>
							)}

							{data.data.lastCheckedStatus === true ? (
								<CheckCircleIcon className="block h-4 w-4 text-green-400" />
							) : data.data.lastCheckedStatus === false ? (
								<XCircleIcon className="block h-4 w-4 text-red-400" />
							) : (
								<ShieldQuestionIcon className="block h-4 w-4 text-neutral-400 dark:text-neutral-600" />
							)}
						</div>

						<p className="text-base font-semibold">{((data.data.uptimeUp / data.data.uptimeAll) * 100).toFixed(2)}%</p>
					</div>

					<ol className="grid h-10 w-full grid-cols-[repeat(30,_minmax(0,_1fr))] gap-0.5">
						{padArrayStart(data.data.uptimeHistory.toReversed(), 30, null).map((check, idx) => (
							<li
								className={twMerge([
									'h-full w-full bg-green-400 first:rounded-l-lg last:rounded-r-lg',
									check === true
										? 'bg-green-400'
										: check === false
											? 'bg-red-400'
											: 'bg-neutral-200 dark:bg-neutral-800',
								])}
								aria-label={check === true ? 'Up' : check === false ? 'Down' : 'Unknown'}
								key={idx}
							/>
						))}
					</ol>

					{data.config.lighthouse?.enabled === true && (
						<div className="mt-6 grid grid-cols-2 gap-6 self-stretch lg:grid-cols-4">
							<div className="flex flex-col">
								<span className="text-sm font-medium">{readableLighthouseTitle.performance}</span>
								<span className="text-lg font-bold">{(data.data.lighthousePerformance! * 100).toFixed(0)}</span>
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-medium">{readableLighthouseTitle.accessibility}</span>
								<span className="text-lg font-bold">{(data.data.lighthouseAccessibility! * 100).toFixed(0)}</span>
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-medium">{readableLighthouseTitle.bestPractices}</span>
								<span className="text-lg font-bold">{(data.data.lighthouseBestPractices! * 100).toFixed(0)}</span>
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-medium">{readableLighthouseTitle.seo}</span>
								<span className="text-lg font-bold">{(data.data.lighthouseSeo! * 100).toFixed(0)}</span>
							</div>
						</div>
					)}
				</div>
			</li>
		</>
	);
};

export default Card;
