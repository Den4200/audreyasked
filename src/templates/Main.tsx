import React, { ReactNode } from 'react';

import {
  ClipboardListIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactTooltip from 'react-tooltip';

import Loading from '@/components/Loading';
import Meta from '@/layout/Meta';
import { AppConfig } from '@/utils/AppConfig';

type MainProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const Main = (props: MainProps) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: false,
  });

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-md flex-col px-4 pt-4 text-gray-700">
      <Meta title={props.title} description={props.description} />
      <ReactTooltip
        id="nav-tooltip"
        effect="solid"
        backgroundColor="white"
        border
        borderColor="#F472B6"
        textColor="#374151"
        place="left"
      />

      <div className="mb-4 flex justify-between border-b border-gray-300">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-900">
            {props.title}
          </h1>
          <h2 className="mb-4 text-xl">{props.description}</h2>
        </div>
        <div className="-mt-4 flex items-center space-x-2">
          <Link href="/" passHref={true}>
            <HomeIcon
              className="w-8 cursor-pointer"
              data-tip="Home"
              data-for="nav-tooltip"
            />
          </Link>
          {session === null ? (
            <LoginIcon
              className="w-8 cursor-pointer"
              onClick={() => {
                if (!router.asPath.startsWith('/auth/signin')) {
                  signIn();
                }
              }}
              data-tip="Sign in"
              data-for="nav-tooltip"
            />
          ) : (
            <>
              <Link href="/polls" passHref={true}>
                <ClipboardListIcon
                  className="w-8 cursor-pointer"
                  data-tip="Polls"
                  data-for="nav-tooltip"
                />
              </Link>
              <LogoutIcon
                className="w-8 cursor-pointer"
                onClick={() => signOut({ callbackUrl: '/' })}
                data-tip="Sign out"
                data-for="nav-tooltip"
              />
            </>
          )}
        </div>
      </div>

      <div className="content grow">{props.children}</div>

      <footer className="mt-4 border-t border-gray-300 py-6 text-center text-sm">
        Copyright &copy; {new Date().getFullYear()} {AppConfig.title}. All
        Rights Reserved.
      </footer>
    </div>
  );
};

export default Main;
