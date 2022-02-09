import React, { useState } from 'react';

import Image from 'next/image';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import ConfettiForm from '@/components/ConfettiForm';
import UnderlineLink from '@/components/link/UnderlineLink';
import TextInput from '@/components/TextInput';
import banner from '@/public/assets/banner.png';
import Main from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

const Index = () => {
  const [input, setInput] = useState<string>();

  return (
    <Main title={AppConfig.title} description={AppConfig.description}>
      <Image
        className="border-b border-gray-300 pb-4"
        src={banner}
        alt="banner"
      />
      <hr className="my-2 border-gray-300" />

      <div className="mx-2 my-4 rounded border-2 border-pink-300 bg-pink-200 p-2">
        <h2 className="text-xl font-semibold">Who asked?</h2>
        <p>
          <span className="font-semibold text-pink-500">Audrey</span> asked.
        </p>
      </div>
      <div className="text-md m-2 flex flex-col justify-around">
        <div>
          Go to <UnderlineLink href="/polls">your polls</UnderlineLink> and
          create a new one!
        </div>
        <div className="mt-4 space-y-2">
          <h2 className="text-xl font-semibold">Here are some cool people:</h2>
          <div className="ml-2 flex">
            <Checkbox className="mr-4" /> Audrey
          </div>
          <div className="ml-2 flex">
            <Checkbox className="mr-4" /> Edric
          </div>
          <div className="ml-2 flex">
            <Checkbox className="mr-4" /> Ty
          </div>
          <div className="ml-2 flex">
            <Checkbox className="mr-4" /> Dennis
          </div>
        </div>
        <div className="mt-4">
          <ConfettiForm onSubmit={() => setInput('')}>
            <TextInput
              onChange={(event) => setInput(event.target.value)}
              value={input}
              required
              placeholder="Who's your favorite?"
            />
            <Button className="ml-2">Submit</Button>
          </ConfettiForm>
        </div>
      </div>
    </Main>
  );
};

export default Index;
