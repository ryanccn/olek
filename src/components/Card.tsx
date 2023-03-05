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
			<div className="flex flex-col items-start rounded-lg bg-neutral-50 p-8 dark:bg-neutral-800">
				<h2 className="mb-8 flex flex-wrap items-center gap-4">
					<span className="text-2xl font-bold tracking-tight">
						{data.config.name}
					</span>

					{data.data.uptime && (
						<div className="flex items-center gap-x-1">
							<span
								className={clsx([
									'block h-2 w-2 rounded-full',
									data.data.uptime.history[0] ? 'bg-green-400' : 'bg-red-400',
								])}
							/>
							{data.data.uptime.history[0] &&
							data.data.uptime.history[0] > 0 ? (
								<span className="block rounded-full text-xs font-medium text-green-400">
									{data.data.uptime.history[0].toFixed(1)}ms
								</span>
							) : null}
						</div>
					)}
				</h2>

				{data.data.uptime && (
					<ol className="grid h-10 w-full grid-cols-[repeat(30,_minmax(0,_1fr))] gap-0.5">
						{[...data.data.uptime.history].reverse().map((check, idx) => (
							<li
								key={idx}
								className={clsx([
									'h-full w-full bg-green-400',
									idx === 0 ? 'rounded-l' : null,
									idx === data.data.uptime.history.length - 1
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
					<div className="mt-6 grid grid-cols-2 gap-6 self-stretch lg:grid-cols-4">
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
