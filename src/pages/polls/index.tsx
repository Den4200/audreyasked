import { useEffect, useState } from 'react';

import {
  DocumentAddIcon,
  DocumentReportIcon,
  EmojiSadIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';

import ButtonLink from '@/components/link/ButtonLink';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
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
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [pollToDelete, setPollToDelete] = useState<Poll | null>(null);

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

  const deletePoll = async () => {
    if (pollToDelete) {
      const { data } = await axios.delete(`polls/${pollToDelete.id}`);
      if (data.deleted === 1) {
        setPollToDelete(null);
        await getPolls();
      }
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
            backgroundColor="white"
            border
            borderColor="#F472B6"
            textColor="#374151"
            place="bottom"
          />
          <Modal
            open={isDeleteOpen}
            setOpen={setIsDeleteOpen}
            title={`Delete ${pollToDelete?.schema.title || 'poll'}`}
            description="This will permanently delete your poll."
            body={`Are you sure you want to delete ${
              pollToDelete?.schema.title || 'your poll'
            }? All responses will be
          removed alongside it.`}
            submitText="Delete"
            onSubmit={deletePoll}
          />
          <ButtonLink href="/polls/new" className="mb-4 w-full text-center">
            <DocumentAddIcon width={24} className="mb-1 inline-block" />{' '}
            <span className="mt-1 inline-block">Create Poll</span>
          </ButtonLink>
          <hr className="mb-4 border-gray-300" />
          <div className="flex flex-wrap justify-center md:justify-start">
            {polls.length !== 0 ? (
              polls.map((poll) => (
                <div
                  key={poll.id}
                  className="md:min-h-32 min-h-40 relative mx-2 mb-4 w-80 rounded border-2 border-pink-300 bg-white p-2 md:w-56"
                >
                  <div className="flex justify-between">
                    <Link href={`/polls/${poll.id}`} passHref={true}>
                      <h2 className="cursor-pointer text-2xl font-semibold transition-colors duration-300 hover:text-pink-500">
                        {poll.schema.title}
                      </h2>
                    </Link>
                    <div className="space-x-2 text-gray-500">
                      <Link
                        href={`/polls/${poll.id}/responses`}
                        passHref={true}
                      >
                        <DocumentReportIcon
                          className="ml-2 mt-1 inline-block w-6 cursor-pointer"
                          data-tip="Responses"
                          data-for="tooltip"
                        />
                      </Link>
                      <Link href={`/polls/${poll.id}/edit`} passHref={true}>
                        <PencilIcon
                          className="mt-1 inline-block w-6 cursor-pointer"
                          data-tip="Edit"
                          data-for="tooltip"
                        />
                      </Link>
                      <TrashIcon
                        className="mt-1 inline-block w-6 cursor-pointer"
                        onClick={() => {
                          setPollToDelete(poll);
                          setIsDeleteOpen(true);
                        }}
                        data-tip="Delete"
                        data-for="tooltip"
                      />
                    </div>
                  </div>
                  <hr className="mb-1 border-gray-300" />
                  {responseCounts[poll.id]} response
                  {responseCounts[poll.id] === 1 ? null : 's'}
                  <div className="mt-10" />
                  <div className="absolute bottom-0 mb-2 text-xs text-gray-400">
                    Created: {new Date(poll.createdAt).toLocaleString()}
                    <br />
                    {poll.createdAt === poll.updatedAt ? null : (
                      <>Updated: {new Date(poll.updatedAt).toLocaleString()}</>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400">
                <EmojiSadIcon className="inline-block w-8" />
                <span className="mx-2">Wow, there&apos;s nothing here..</span>
                <EmojiSadIcon className="inline-block w-8" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Main>
  );
};

export default Polls;
