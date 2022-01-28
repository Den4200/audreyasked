import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export interface AuthApiRequest extends NextApiRequest {
  session: Session;
}

export type AuthApiHandler<T = any> = (
  req: AuthApiRequest,
  res: NextApiResponse<T>
) => Promise<void> | void;

const withAuth =
  (handler: AuthApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
      handler({ ...req, session } as AuthApiRequest, res);
    } else {
      res.status(403).json({ message: '401 Forbidden' });
    }
  };

export default withAuth;
