export interface WebsiteData {
	name: string;
	url: string;
	uptime?: {
		history: number[];
		up: number;
		all: number;
		lastChecked: string | null;
	};
	lighthouse?: Record<string, number>;
}
