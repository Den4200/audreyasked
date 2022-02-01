import { useEffect, useState } from 'react';

import Link from 'next/link';

import ButtonLink from '@/components/link/ButtonLink';
import UnderlineLink from '@/components/link/UnderlineLink';
import Loading from '@/components/Loading';
import { useAuth } from '@/lib/auth';
import axios from '@/lib/axios';
import Main from '@/templates/Main';
import { Poll } from '@/utils/types';

const Polls = () => {
  const [polls, setPolls] = useState<Poll[]>();

  const getPolls = async () => {
    const { data } = await axios.get('polls');
    setPolls(data.polls);
  };

  const deletePoll = async (pollId: string) => {
    const { data } = await axios.delete(`polls/${pollId}`);
    if (data.deleted === 1) {
      await getPolls();
    }
  };

  useEffect(() => {
    getPolls();
  }, []);

  return useAuth(
    <Main title="Your polls" description="See your polls here!">
      {polls ? (
        <div className="flex flex-col justify-center">
          <ButtonLink href="/polls/new" className="w-full mb-4 text-center">
            + Create Poll
          </ButtonLink>
          <hr className="border-gray-300 mb-4" />
          <div className="flex md:justify-start justify-center flex-wrap">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="border-2 border-pink-300 rounded mb-4 p-2 md:w-56 w-80 mx-2 md:h-32 h-40"
              >
                <Link href={`/polls/${poll.id}`} passHref={true}>
                  <h2 className="text-2xl font-semibold cursor-pointer hover:text-pink-500 transition-colors duration-300">
                    {poll.schema.title}
                  </h2>
                </Link>
                <hr className="border-gray-300 mb-2" />
                <div className="text-gray-500 space-x-2">
                  <UnderlineLink href={`/polls/${poll.id}/responses`}>
                    Responses
                  </UnderlineLink>
                  <UnderlineLink href={`/polls/${poll.id}/edit`}>
                    Edit
                  </UnderlineLink>
                  <UnderlineLink
                    href=""
                    onClick={async () => deletePoll(poll.id)}
                  >
                    Delete
                  </UnderlineLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Main>
  );
};

export default Polls;
