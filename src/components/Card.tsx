import type { WebsiteData } from '~/types/data';
import clsx from 'clsx';

const readableLighthouseTitle = {
	performance: 'Performance',
	accessibility: 'Accessibility',
	bestPractices: 'Best Practices',
	seo: 'SEO',
};

const Card = ({ data }: { data: WebsiteData }) => {
	return (
		<li>
			<a
				href={data.url}
				className="flex flex-col rounded-lg bg-neutral-50 hover:bg-neutral-100 p-8 items-start focus:outline-none focus:ring"
			>
				<h2 className="flex items-center gap-4 mb-1 flex-wrap">
					<span className="font-bold tracking-tight text-2xl">{data.name}</span>

					{data.uptime && (
						<div className="flex items-center gap-x-1">
							<span
								className={clsx([
									'block w-2 h-2 rounded-full',
									data.uptime.history[0] ? 'bg-green-400' : 'bg-red-400',
								])}
							/>
							{data.uptime.history[0] && data.uptime.history[0] > 0 && (
								<span className="block rounded-full text-green-400 text-xs font-medium">
									{data.uptime.history[0].toFixed(1)}ms
								</span>
							)}
						</div>
					)}
				</h2>

				<p className="text-neutral-400 text-sm mb-5">{data.url}</p>

				{data.uptime && (
					<ol className="grid grid-cols-[repeat(30,_minmax(0,_1fr))] gap-0.5 w-full h-10">
						{[...data.uptime.history].reverse().map((check, idx) => (
							<li
								key={idx}
								className={clsx([
									'w-full h-full bg-green-400',
									idx === 0 ? 'rounded-l' : null,
									idx === data.uptime!.history.length - 1 ? 'rounded-r' : null,
									check > 0
										? 'bg-green-400'
										: check === 0
										? 'bg-red-400'
										: 'bg-neutral-200',
								])}
								aria-label={check > 0 ? 'Up' : check === 0 ? 'Down' : 'Unknown'}
							/>
						))}
					</ol>
				)}

				{data.lighthouse && (
					<div className="grid grid-cols-2 lg:grid-cols-4 self-stretch gap-6 mt-6">
						{Object.keys(data.lighthouse).map((key) => (
							<div className="flex flex-col" key={key}>
								<span className="text-sm font-medium">
									{readableLighthouseTitle[key]}
								</span>
								<span className="text-lg font-bold">
									{(data.lighthouse[key] * 100).toFixed(0)}
								</span>
							</div>
						))}
					</div>
				)}
			</a>
		</li>
	);
};

export default Card;
