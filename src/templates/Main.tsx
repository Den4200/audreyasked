import React, { ReactNode } from 'react';

import {
  ClipboardListIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
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
  const { data: session, status } = useSession({
    required: false,
  });

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="flex flex-col px-4 pt-4 min-h-screen max-w-screen-md mx-auto text-gray-700">
      <Meta title={props.title} description={props.description} />

      <div className="flex mb-4 border-b border-gray-300 justify-between">
        <div>
          <h1 className="font-bold mb-1 text-3xl text-gray-900">
            {props.title}
          </h1>
          <h2 className="mb-4 text-xl">{props.description}</h2>
        </div>
        <div className="md:flex inline-block md:space-x-2">
          <ReactTooltip
            id="nav-tooltip"
            effect="solid"
            backgroundColor="#FDF2F8"
            border
            borderColor="#F472B6"
            textColor="#374151"
            place="left"
          />

          <Link href="/" passHref={true}>
            <HomeIcon
              className="cursor-pointer w-8"
              data-tip="Home"
              data-for="nav-tooltip"
            />
          </Link>
          {session === null ? (
            <LoginIcon
              className="cursor-pointer w-8"
              onClick={() => signIn('discord')}
              data-tip="Sign in"
              data-for="nav-tooltip"
            />
          ) : (
            <>
              <Link href="/polls" passHref={true}>
                <ClipboardListIcon
                  className="cursor-pointer w-8"
                  data-tip="Polls"
                  data-for="nav-tooltip"
                />
              </Link>
              <LogoutIcon
                className="cursor-pointer w-8"
                onClick={() => signOut()}
                data-tip="Sign out"
                data-for="nav-tooltip"
              />
            </>
          )}
        </div>
      </div>

      <div className="grow content">{props.children}</div>

      <footer className="mt-4 border-t border-gray-300 text-center py-6 text-sm">
        Copyright &copy; {new Date().getFullYear()} {AppConfig.title}. All
        Rights Reserved.
      </footer>
    </div>
  );
};

export default Main;
