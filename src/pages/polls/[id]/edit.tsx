import { useEffect } from 'react';

import { useRouter } from 'next/router';

import PollEditor from '@/components/PollEditor';
import usePoll from '@/hooks/poll';
import { usePollSchema } from '@/hooks/pollSchema';
import { useAuth } from '@/lib/auth';
import axios from '@/lib/axios';

const EditPoll = () => {
  const router = useRouter();
  const { poll, setPollId } = usePoll();
  const { pollSchema, setPollSchema } = usePollSchema();

  useEffect(() => {
    if (!router.query.id) {
      return;
    }

    setPollId(router.query.id.toString());
  }, [router.query.id, setPollId]);

  useEffect(() => {
    setPollSchema(poll.schema);
  }, [poll.schema, setPollSchema]);

  const onSubmit = async () => {
    const { data } = await axios.put(`polls/${router.query.id}`, {
      poll: { schema: pollSchema },
    });

    if (data.updated === 1) {
      router.push(`/polls/${router.query.id}`);
    }
  };

  return useAuth(
    <PollEditor
      title="Edit Poll"
      description="Edit a poll here!"
      submitText="Save poll!"
      onSubmit={onSubmit}
    />,
    true,
    poll.authorId
  );
};

export default EditPoll;
