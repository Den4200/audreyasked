import PollEditor from '@/components/PollEditor';
import { usePollSchema } from '@/hooks/pollSchema';
import Meta from '@/layout/Meta';
import axios from '@/lib/axios';

const NewPoll = () => {
  const { pollSchema } = usePollSchema();

  const onSubmit = async () =>
    axios.post('polls', {
      poll: { schema: pollSchema },
    });

  return (
    <PollEditor
      meta={<Meta title="New Poll" description="Create a new poll here!" />}
      submitText="Create poll!"
      onSubmit={onSubmit}
    />
  );
};

export default NewPoll;
