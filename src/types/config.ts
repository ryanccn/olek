import { z } from 'zod';

export const ConfigWebsite = z.object({
	name: z.string(),
	url: z.string().url(),
	public: z.boolean().optional(),
	uptime: z.object({ method: z.string() }).partial().optional(),
	lighthouse: z.object({ enabled: z.boolean() }).partial().optional(),
});
export type ConfigWebsite = z.infer<typeof ConfigWebsite>;

export const Config = ConfigWebsite.array();
export type Config = z.infer<typeof Config>;

export const defineConfig = (config: Config) => Config.parse(config);
