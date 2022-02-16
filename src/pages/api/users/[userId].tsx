import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

import prisma from '@/lib/prisma';

const userHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  const userId = req.query.userId!.toString();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { email, ...userWithoutEmail } = user;

      res.status(200).json({
        user: user.id === session?.user.id ? user : userWithoutEmail,
      });
      break;
    }
    case 'PATCH': {
      if (user.id !== session?.user.id) {
        res.status(403).json({ message: '403 Forbidden' });
        return;
      }

      const { name } = req.body.user;
      if (!name) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        return;
      }

      const { count } = await prisma.user.updateMany({
        data: { name },
        where: { id: userId },
      });

      res.status(200).json({ updated: count });
      break;
    }
    default: {
      res.status(405).json({ message: '405 Method Not Allowed' });
      break;
    }
  }
};

export default userHandler;
