import React, { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="flex flex-col px-4 pt-4 min-h-screen max-w-screen-md mx-auto text-gray-700">
    {props.meta}

    <div className="mb-4 border-b border-gray-300">
      <h1 className="font-bold mb-1 text-3xl text-gray-900">
        {AppConfig.title}
      </h1>
      <h2 className="mb-4 text-xl">{AppConfig.description}</h2>
    </div>

    <div className="grow content">{props.children}</div>

    <footer className="mt-4 border-t border-gray-300 text-center py-6 text-sm">
      Copyright &copy; {new Date().getFullYear()} {AppConfig.title}. All Rights
      Reserved.
    </footer>
  </div>
);

export default Main;
