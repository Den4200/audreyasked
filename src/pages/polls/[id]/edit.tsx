import { useEffect } from 'react';

import { useRouter } from 'next/router';

import PollEditor from '@/components/PollEditor';
import { usePollSchema } from '@/hooks/pollSchema';
import axios from '@/lib/axios';

const EditPoll = () => {
  const router = useRouter();
  const { pollSchema, setPollSchema } = usePollSchema();

  useEffect(() => {
    const applyPollSchema = async () => {
      if (!router.query.id) {
        return;
      }

      const { data } = await axios.get(`polls/${router.query.id}`);
      setPollSchema(data.poll.schema);
    };
    applyPollSchema();
  }, [router.query.id, setPollSchema]);

  const onSubmit = async () => {
    const { data } = await axios.put(`polls/${router.query.id}`, {
      poll: { schema: pollSchema },
    });

    if (data.updated === 1) {
      router.push(`/polls/${router.query.id}`);
    }
  };

  return (
    <PollEditor
      title="Edit Poll"
      description="Edit a poll here!"
      submitText="Update poll!"
      onSubmit={onSubmit}
    />
  );
};

export default EditPoll;
