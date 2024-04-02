import '~/styles/tailwind.css';

import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
	display: 'swap',
	variable: '--font-space-grotesk',
	subsets: ['latin'],
	preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={spaceGrotesk.variable}>
			<body>{children}</body>
		</html>
	);
}
