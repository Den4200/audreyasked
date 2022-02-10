import { ReactNode } from 'react';

import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession, signIn, useSession } from 'next-auth/react';

import Loading from '@/components/Loading';

export interface AuthApiRequest extends NextApiRequest {
  session: Session;
}

export type AuthApiHandler<T = any> = (
  req: AuthApiRequest,
  res: NextApiResponse<T>
) => Promise<void> | void;

export const withAuth =
  (handler: AuthApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
      handler({ ...req, session } as AuthApiRequest, res);
    } else {
      res.status(401).json({ message: '401 Unauthorized' });
    }
  };

export const useAuth = (node: ReactNode, required: boolean = true) => {
  const { status } = useSession({
    required,
    onUnauthenticated: () => signIn('discord'),
  });

  if (status === 'loading') {
    return <Loading />;
  }

  return node;
};
