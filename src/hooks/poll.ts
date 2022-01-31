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
  });

  useEffect(() => {
    const getPoll = async () => {
      const { data } = await axios.get(`polls/${pollId}`);
      setPoll(data.poll);
    };

    if (pollId) {
      getPoll();
    }
  }, [pollId, setPoll]);

  return { poll, setPollId };
};

export default usePoll;
