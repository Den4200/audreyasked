import { useEffect, useState } from 'react';

import {
  DocumentAddIcon,
  DocumentReportIcon,
  PencilIcon,
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

type ResponseCounts = {
  [pollId: string]: number;
};

const Polls = () => {
  const [polls, setPolls] = useState<Poll[]>();
  const [responseCounts, setResponseCounts] = useState<ResponseCounts>({});

  const getPolls = async () => {
    const { data } = await axios.get('polls');
    setPolls(data.polls);

    const counts: ResponseCounts = {};
    await Promise.all(
      data.polls.map(async (poll: Poll) => {
        counts[poll.id] = (
          await axios.get(`polls/${poll.id}/responses/count`)
        ).data.count;
      })
    );

    setResponseCounts(counts);
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
                className="relative border-2 border-pink-300 bg-white rounded mb-4 p-2 md:w-56 w-80 mx-2 md:min-h-32 min-h-40"
              >
                <div className="flex justify-between">
                  <Link href={`/polls/${poll.id}`} passHref={true}>
                    <h2 className="text-2xl font-semibold cursor-pointer hover:text-pink-500 transition-colors duration-300">
                      {poll.schema.title}
                    </h2>
                  </Link>
                  <div className="text-gray-500 space-x-2">
                    <Link href={`/polls/${poll.id}/responses`} passHref={true}>
                      <DocumentReportIcon
                        className="cursor-pointer w-6 inline-block"
                        data-tip="Responses"
                        data-for="tooltip"
                      />
                    </Link>
                    <Link href={`/polls/${poll.id}/edit`} passHref={true}>
                      <PencilIcon
                        className="cursor-pointer w-6 inline-block"
                        data-tip="Edit"
                        data-for="tooltip"
                      />
                    </Link>
                    <TrashIcon
                      className="cursor-pointer w-6 inline-block"
                      onClick={async () => deletePoll(poll.id)}
                      data-tip="Delete"
                      data-for="tooltip"
                    />
                  </div>
                </div>
                <hr className="border-gray-300 mb-1" />
                {responseCounts[poll.id]} response
                {responseCounts[poll.id] === 1 ? null : 's'}
                <div className="mt-10" />
                <div className="text-xs text-gray-400 absolute bottom-0 mb-2">
                  Created: {new Date(poll.createdAt).toLocaleString()}
                  <br />
                  {poll.createdAt === poll.updatedAt ? null : (
                    <>Updated: {new Date(poll.updatedAt).toLocaleString()}</>
                  )}
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
