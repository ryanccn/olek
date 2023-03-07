/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['src/**/*.{html,js,jsx,ts,tsx}'],
	theme: {
		extend: {
			keyframes: {
				slideDownAndFade: {
					from: { opacity: 0, transform: 'translateY(-2px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				slideLeftAndFade: {
					from: { opacity: 0, transform: 'translateX(2px)' },
					to: { opacity: 1, transform: 'translateX(0)' },
				},
				slideUpAndFade: {
					from: { opacity: 0, transform: 'translateY(2px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				slideRightAndFade: {
					from: { opacity: 0, transform: 'translateX(2px)' },
					to: { opacity: 1, transform: 'translateX(0)' },
				},
			},

			animation: {
				slideDownAndFade:
					'slideDownAndFade 350ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideLeftAndFade:
					'slideLeftAndFade 350ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideUpAndFade: 'slideUpAndFade 350ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideRightAndFade:
					'slideRightAndFade 350ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [],
};
