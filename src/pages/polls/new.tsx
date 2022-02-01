import { useEffect } from 'react';

import { useRouter } from 'next/router';

import PollEditor from '@/components/PollEditor';
import { usePollSchema } from '@/hooks/pollSchema';
import { useAuth } from '@/lib/auth';
import axios from '@/lib/axios';

const NewPoll = () => {
  const router = useRouter();
  const { pollSchema, resetPollSchema } = usePollSchema();

  useEffect(() => {
    resetPollSchema();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async () => {
    const { data } = await axios.post('polls', {
      poll: { schema: pollSchema },
    });

    router.push(`/polls/${data.poll.id}`);
  };

  return useAuth(
    <PollEditor
      title="New Poll"
      description="Create a new poll here!"
      submitText="Create poll!"
      onSubmit={onSubmit}
    />
  );
};

export default NewPoll;
