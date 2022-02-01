import { NextApiHandler } from 'next';

import { withAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parsePoll } from '@/utils/types';

const pollHandler: NextApiHandler = async (req, res) => {
  const pollId = req.query.pollId?.toString();
  const poll = await prisma.poll.findFirst({
    select: {
      id: true,
      schema: true,
      createdAt: true,
      updatedAt: true,
      author: true,
    },
    where: { id: pollId },
  });

  if (!poll) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { author, ...resPoll } = poll;
      res.status(200).json({ poll: parsePoll(resPoll) });
      break;
    }

    case 'PUT': {
      const pollPutHandler = withAuth(async (aReq, aRes) => {
        if (poll.author.email !== aReq.session.user?.email) {
          aRes.status(403).json({ message: '403 Forbidden' });
          return;
        }

        const pollSchema = JSON.stringify(aReq.body.poll.schema);
        if (!pollSchema) {
          aRes.status(422).json({ message: '422 Unprocessable Entity' });
          return;
        }

        const { count } = await prisma.poll.updateMany({
          data: { schema: pollSchema },
          where: { id: pollId },
        });

        aRes.status(200).json({ updated: count });
      });
      pollPutHandler(req, res);
      break;
    }

    case 'DELETE': {
      const pollDeleteHandler = withAuth(async (aReq, aRes) => {
        if (poll.author.email !== aReq.session.user?.email) {
          aRes.status(403).json({ message: '403 Forbidden' });
          return;
        }

        const { count } = await prisma.poll.deleteMany({
          where: {
            id: pollId,
            author: { email: aReq.session.user?.email },
          },
        });

        aRes.status(200).json({ deleted: count });
      });
      pollDeleteHandler(req, res);
      break;
    }

    default: {
      res.status(405).json({ message: '405 Method Not Allowed' });
      break;
    }
  }
};

export default pollHandler;
