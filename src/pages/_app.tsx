import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import type { AppProps } from 'next/app';
import '~/styles/tailwind.css';

export default function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<TooltipProvider>
			<Component {...pageProps} />
		</TooltipProvider>
	);
}
