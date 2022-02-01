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
        className="pb-4 border-b border-gray-300"
        src={banner}
        alt="banner"
      />
      <hr className="border-gray-300 my-2" />

      <div className="bg-pink-200 mx-2 my-4 rounded p-2 border-2 border-pink-300">
        <h2 className="text-xl font-semibold">Who asked?</h2>
        <p>
          <span className="text-pink-500 font-semibold">Audrey</span> asked.
        </p>
      </div>
      <div className="m-2 flex flex-col justify-around text-md">
        <div>
          Go to <UnderlineLink href="/polls">your polls</UnderlineLink> and
          create a new one!
        </div>
        <div className="mt-4 space-y-2">
          <h2 className="text-xl font-semibold">Here are some cool people:</h2>
          <div className="flex ml-2">
            <Checkbox className="mr-4" /> Audrey
          </div>
          <div className="flex ml-2">
            <Checkbox className="mr-4" /> Edric
          </div>
          <div className="flex ml-2">
            <Checkbox className="mr-4" /> Ty
          </div>
          <div className="flex ml-2">
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
