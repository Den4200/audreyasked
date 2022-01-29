import PollEditor from '@/components/PollEditor';
import { usePollSchema } from '@/hooks/pollSchema';
import axios from '@/lib/axios';

const NewPoll = () => {
  const { pollSchema } = usePollSchema();

  const onSubmit = async () =>
    axios.post('polls', {
      poll: { schema: pollSchema },
    });

  return <PollEditor submitText="Create poll!" onSubmit={onSubmit} />;
};

export default NewPoll;
