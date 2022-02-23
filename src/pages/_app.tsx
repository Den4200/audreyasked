import { useEffect, useState } from 'react';

import '@/styles/global.css';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  DndProvider,
  MouseTransition,
  TouchTransition,
} from 'react-dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import Loading from '@/components/Loading';
import { ErrorHandlerProvider } from '@/hooks/errorHandler';
import { PollSchemaProvider } from '@/hooks/pollSchema';

const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

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
    // @ts-ignore
    <DndProvider options={HTML5toTouch}>
      <SessionProvider session={session}>
        <ErrorHandlerProvider>
          <PollSchemaProvider>
            {loading ? <Loading /> : null}
            <Component {...pageProps} />
          </PollSchemaProvider>
        </ErrorHandlerProvider>
      </SessionProvider>
    </DndProvider>
  );
};

export default MyApp;
