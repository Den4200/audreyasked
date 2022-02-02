import { useEffect, useState } from 'react';

import {
  DocumentAddIcon,
  PencilIcon,
  PresentationChartBarIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';

import ButtonLink from '@/components/link/ButtonLink';
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
          <ReactTooltip
            id="tooltip"
            effect="solid"
            backgroundColor="#FDF2F8"
            border
            borderColor="#F472B6"
            textColor="#374151"
            place="bottom"
          />
          <ButtonLink href="/polls/new" className="w-full mb-4 text-center">
            <DocumentAddIcon width={24} className="inline-block mb-1" />{' '}
            <span className="inline-block mt-1">Create Poll</span>
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
                <div className="flex text-gray-500 space-x-2">
                  <Link href={`/polls/${poll.id}/responses`} passHref={true}>
                    <PresentationChartBarIcon
                      className="cursor-pointer w-6"
                      data-tip="Responses"
                      data-for="tooltip"
                    />
                  </Link>
                  <Link href={`/polls/${poll.id}/edit`} passHref={true}>
                    <PencilIcon
                      className="cursor-pointer w-6"
                      data-tip="Edit"
                      data-for="tooltip"
                    />
                  </Link>
                  <TrashIcon
                    className="cursor-pointer w-6"
                    onClick={async () => deletePoll(poll.id)}
                    data-tip="Delete"
                    data-for="tooltip"
                  />
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
