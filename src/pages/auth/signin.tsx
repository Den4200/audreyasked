import { useState } from 'react';

import { GetServerSideProps } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import Image from 'next/image';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import banner from '@/public/assets/banner.png';
import Main from '@/templates/Main';

type SignInProps = {
  callbackUrl: string;
  csrfToken: string;
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
};

const SignIn = (props: SignInProps) => {
  const [email, setEmail] = useState<string>('');

  return (
    <Main title="Sign in" description="Please sign in below.">
      <div className="border-2 border-pink-300 rounded bg-white p-4">
        <h1 className="text-2xl text-center font-bold">Audrey Asked</h1>
        <hr className="border-gray-300 mt-2 mb-3" />
        <Image src={banner} alt="" />
        <hr className="border-gray-300 mt-2 mb-4" />

        <div className="flex flex-col items-center">
          <input name="csrfToken" type="hidden" value={props.csrfToken} />
          <label>
            <span className="text-pink-400 text-sm font-semibold">
              Email address
            </span>
            <br />
            <TextInput
              className="w-80 shadow"
              placeholder="example@email.com"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <Button
            className="mt-4 shadow-md"
            onClick={() =>
              signIn('email', { email, callbackUrl: props.callbackUrl })
            }
          >
            Sign in with Email
          </Button>
        </div>

        <div className="flex justify-center items-center space-x-3 my-3">
          <div className="border-t border-gray-300 w-1/2" />
          <span className="text-gray-400">or</span>
          <div className="border-t border-gray-300 w-1/2" />
        </div>

        <div className="flex flex-col items-center space-y-4 mb-2">
          {Object.values(props.providers).map((provider) =>
            provider.id !== 'email' ? (
              <div key={provider.id}>
                <Button
                  className="bg-white border-2 border-pink-400 text-pink-400 shadow-md hover:bg-pink-400"
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: props.callbackUrl })
                  }
                >
                  Sign in with {provider.name}
                </Button>
              </div>
            ) : null
          )}
        </div>
      </div>
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    callbackUrl: context.query.callbackUrl?.toString() || '/polls/',
    csrfToken: await getCsrfToken(context),
    providers: await getProviders(),
  },
});

export default SignIn;
