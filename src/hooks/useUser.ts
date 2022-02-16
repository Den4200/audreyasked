import { useEffect, useState } from 'react';

import axios from '@/lib/axios';
import { User } from '@/utils/types';

const useUser = (id?: string) => {
  const [userId, setUserId] = useState<string>(id || '');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get(`users/${userId}`);
      setUser(data.user);
    };

    if (userId) {
      getUser();
    }
  }, [userId]);

  const updateUser = async () => {
    const { data } = await axios.patch(`users/${userId}`, { user });
    return data.updated as number;
  };

  return { user, setUser, setUserId, updateUser };
};

export default useUser;
