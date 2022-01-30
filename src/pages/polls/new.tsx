import { useRouter } from 'next/router';

import PollEditor from '@/components/PollEditor';
import { usePollSchema } from '@/hooks/pollSchema';
import axios from '@/lib/axios';

const NewPoll = () => {
  const router = useRouter();
  const { pollSchema } = usePollSchema();

  const onSubmit = async () => {
    const { data } = await axios.post('polls', {
      poll: { schema: pollSchema },
    });

    router.push(`/polls/${data.poll.id}`);
  };

  return (
    <PollEditor
      title="New Poll"
      description="Create a new poll here!"
      submitText="Create poll!"
      onSubmit={onSubmit}
    />
  );
};

export default NewPoll;
