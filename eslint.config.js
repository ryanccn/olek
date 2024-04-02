import { config } from '@ryanccn/eslint-config';

export default config({
	globals: ['browser', 'node', 'es2021'],
	next: true,
	reactHooks: true,
	rules: {
		'unicorn/numeric-separators-style': 'off',
	},
});
