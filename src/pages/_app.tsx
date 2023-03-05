import type { AppProps } from 'next/app';
import '~/styles/tailwind.css';

export default function CustomApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
