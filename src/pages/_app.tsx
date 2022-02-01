import { useEffect, useState } from 'react';

import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import '@/styles/global.css';
import Loading from '@/components/Loading';
import { PollSchemaProvider } from '@/hooks/pollSchema';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    };
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

  return (
    <SessionProvider session={session}>
      <PollSchemaProvider>
        {loading ? <Loading /> : null}
        <Component {...pageProps} />
      </PollSchemaProvider>
    </SessionProvider>
  );
};

export default MyApp;
