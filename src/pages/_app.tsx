import { AppProps } from 'next/app';

import { PollSchemaProvider } from '@/hooks/pollSchema';

import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <PollSchemaProvider>
    <Component {...pageProps} />
  </PollSchemaProvider>
);

export default MyApp;
