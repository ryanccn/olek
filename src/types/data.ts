export type WebsiteData = {
	url: string;
	name: string;

	uptimeUp: number;
	uptimeAll: number;
	uptimeHistory: boolean[];

	lastChecked: Date | null;
	lastCheckedStatus: boolean | null;

	lighthousePerformance: number | null;
	lighthouseAccessibility: number | null;
	lighthouseBestPractices: number | null;
	lighthouseSeo: number | null;
};
