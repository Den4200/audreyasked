import React, { useState } from 'react';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import ConfettiForm from '@/components/ConfettiForm';
import ButtonLink from '@/components/link/ButtonLink';
import UnderlineLink from '@/components/link/UnderlineLink';
import RadioButton from '@/components/RadioButton';
import TextInput from '@/components/TextInput';
import Meta from '@/layout/Meta';
import Main from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

const Index = () => {
  const [input, setInput] = useState<string>();

  return (
    <Main
      meta={
        <Meta title={AppConfig.title} description={AppConfig.description} />
      }
    >
      <img
        className="pb-4 border-b border-gray-300"
        src="https://cdn.discordapp.com/attachments/441762222880981013/929447603182108672/audrey_asks.png"
        alt="banner"
      />

      <div className="bg-pink-200 mx-2 my-4 rounded p-2 border-2 border-pink-300">
        <div>Audrey</div>
        <div>is</div>
        <div>cool.</div>
      </div>

      <div className="m-2 flex flex-col justify-around text-md">
        <div>
          This is a <UnderlineLink href="#">super cool link</UnderlineLink> you
          should hover over.
        </div>
        <div className="flex justify-between">
          <ButtonLink className="mt-4" href="#">
            Hello, world!
          </ButtonLink>
        </div>
        <div className="mt-4">
          <div className="flex mb-2">
            <Checkbox className="mr-4" /> I love Audrey
          </div>
          <div className="flex mb-2">
            <Checkbox className="mr-4" /> I love Audrey
          </div>
          <div className="flex mb-2">
            <Checkbox className="mr-4" /> I love Audrey
          </div>
          <div className="flex mb-2">
            <Checkbox className="mr-4" /> I love Audrey
          </div>
        </div>
        <div className="mt-4">
          <form>
            <div className="flex mb-2">
              <RadioButton name="test" className="mr-4" /> I really love her
            </div>
            <div className="flex mb-2">
              <RadioButton name="test" className="mr-4" /> I love her more
            </div>
            <div className="flex mb-2">
              <RadioButton name="test" className="mr-4" /> I love her a lot
            </div>
            <div className="flex mb-2">
              <RadioButton name="test" className="mr-4" /> I love her so much
            </div>
          </form>
        </div>
        <div className="mt-4">
          <ConfettiForm onSubmit={() => setInput('')}>
            <TextInput
              onChange={(event) => setInput(event.target.value)}
              value={input}
              required
              placeholder="Do you love Audrey?"
            />
            <Button className="ml-2">Submit</Button>
          </ConfettiForm>
        </div>
      </div>
    </Main>
  );
};

export default Index;
