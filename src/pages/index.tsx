import Image from 'next/image';

import UnstyledLink from '@/components/link/UnstyledLink';
import banner from '@/public/assets/banner.png';
import Main from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

const Index = () => (
  <Main title={AppConfig.title} description={AppConfig.description}>
    <div className="rounded-[8px] p-[2px] bg-gradient-to-r from-pink-400 to-fuchsia-400">
      <div className="rounded-[6px] bg-gradient-to-r from-pink-200 to-fuchsia-200 px-4 pt-16 pb-4 flex flex-col justify-center items-center">
        <h1 className="md:text-4xl text-3xl text-center font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400">
          Create your own polls!
        </h1>
        <p className="text-lg text-center">
          Sign up today to collect responses.
        </p>

        <UnstyledLink
          className="inline-block mt-4 rounded-[8px] p-[2px] bg-gradient-to-r from-pink-400 to-fuchsia-400 group"
          href="/auth/signin/"
        >
          <div className="px-4 py-2 rounded-[6px] bg-gradient-to-r from-pink-200 to-fuchsia-200">
            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400 group-hover:from-pink-500 group-hover:to-fuchsia-500">
              Sign up
            </p>
          </div>
        </UnstyledLink>

        <div className="mt-16 rounded-[8px] p-[2px] bg-gradient-to-r from-pink-300 to-fuchsia-300 w-full">
          <div className="rounded-[6px] overflow-hidden">
            <Image src={banner} alt="banner" layout="responsive" />
          </div>
        </div>
      </div>
    </div>
  </Main>
);

export default Index;
