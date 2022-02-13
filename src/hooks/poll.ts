import { useEffect, useState } from 'react';

import axios from '@/lib/axios';
import { Poll } from '@/utils/types';

import { useErrorHandler } from './errorHandler';

const usePoll = (id?: string) => {
  const { setError } = useErrorHandler();

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
      try {
        const { data } = await axios.get(`polls/${pollId}`);
        data.poll.createdAt = new Date(data.poll.createdAt);
        data.poll.updatedAt = new Date(data.poll.updatedAt);
        setPoll(data.poll);
      } catch (err: any) {
        setError(err);
      }
    };

    if (pollId) {
      getPoll();
    }
  }, [pollId, setPoll, setError]);

  return { poll, setPollId };
};

export default usePoll;
