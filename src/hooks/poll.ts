import { useEffect, useState } from 'react';

import axios from '@/lib/axios';
import { Poll } from '@/utils/types';

const usePoll = (id?: string) => {
  const [pollId, setPollId] = useState<string | undefined>(id);
  const [poll, setPoll] = useState<Poll>({
    id: '',
    schema: { title: '', sections: [] },
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: '',
  });

  useEffect(() => {
    const getPoll = async () => {
      const { data } = await axios.get(`polls/${pollId}`);
      data.poll.createdAt = new Date(data.poll.createdAt);
      data.poll.updatedAt = new Date(data.poll.updatedAt);
      setPoll(data.poll);
    };

    if (pollId) {
      getPoll();
    }
  }, [pollId, setPoll]);

  return { poll, setPollId };
};

export default usePoll;
