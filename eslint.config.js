import { config } from '@ryanccn/eslint-config';

export default config({
	next: true,
	reactHooks: true,
	rules: {
		'unicorn/numeric-separators-style': 'off',
	},
});
