import type { WebsiteData } from '~/types/data';
import type { ConfigWebsite } from '~/types/config';

import clsx from 'clsx';

const readableLighthouseTitle = {
	performance: 'Performance',
	accessibility: 'Accessibility',
	bestPractices: 'Best Practices',
	seo: 'SEO',
};

const Card = ({
	data,
}: {
	data: { config: ConfigWebsite; data: WebsiteData };
}) => {
	return (
		<li>
			<div className="flex flex-col rounded-lg bg-neutral-50 dark:bg-neutral-800 p-8 items-start">
				<h2 className="flex items-center gap-4 mb-8 flex-wrap">
					<span className="font-bold tracking-tight text-2xl">
						{data.config.name}
					</span>

					{data.data.uptime && (
						<div className="flex items-center gap-x-1">
							<span
								className={clsx([
									'block w-2 h-2 rounded-full',
									data.data.uptime.history[0] ? 'bg-green-400' : 'bg-red-400',
								])}
							/>
							{data.data.uptime.history[0] &&
							data.data.uptime.history[0] > 0 ? (
								<span className="block rounded-full text-green-400 text-xs font-medium">
									{data.data.uptime.history[0].toFixed(1)}ms
								</span>
							) : null}
						</div>
					)}
				</h2>

				{data.data.uptime && (
					<ol className="grid grid-cols-[repeat(30,_minmax(0,_1fr))] gap-0.5 w-full h-10">
						{[...data.data.uptime.history].reverse().map((check, idx) => (
							<li
								key={idx}
								className={clsx([
									'w-full h-full bg-green-400',
									idx === 0 ? 'rounded-l' : null,
									idx === data.data.uptime!.history.length - 1
										? 'rounded-r'
										: null,
									check > 0
										? 'bg-green-400'
										: check === 0
										? 'bg-red-400'
										: 'bg-neutral-200 dark:bg-neutral-600',
								])}
								aria-label={check > 0 ? 'Up' : check === 0 ? 'Down' : 'Unknown'}
							/>
						))}
					</ol>
				)}

				{data.data.lighthouse && (
					<div className="grid grid-cols-2 lg:grid-cols-4 self-stretch gap-6 mt-6">
						{Object.keys(data.data.lighthouse).map((key) => (
							<div className="flex flex-col" key={key}>
								<span className="text-sm font-medium">
									{readableLighthouseTitle[key]}
								</span>
								<span className="text-lg font-bold">
									{(data.data.lighthouse[key] * 100).toFixed(0)}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</li>
	);
};

export default Card;
