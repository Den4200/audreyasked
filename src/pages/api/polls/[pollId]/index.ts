import { AuthApiHandler, withAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parsePoll } from '@/utils/types';

const pollHandler: AuthApiHandler = async (req, res) => {
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
      if (poll.author.email !== req.session.user?.email) {
        res.status(403).json({ message: '403 Forbidden' });
        break;
      }

      const pollSchema = JSON.stringify(req.body.poll.schema);
      if (!pollSchema) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        break;
      }

      const { count } = await prisma.poll.updateMany({
        data: { schema: pollSchema },
        where: { id: pollId },
      });

      res.status(200).json({ updated: count });
      break;
    }

    case 'DELETE': {
      if (poll.author.email !== req.session.user?.email) {
        res.status(403).json({ message: '403 Forbidden' });
        break;
      }

      const { count } = await prisma.poll.deleteMany({
        where: {
          id: req.body.poll.id,
          author: { email: req.session.user?.email },
        },
      });

      res.status(200).json({ deleted: count });
      break;
    }

    default: {
      res.status(405).json({ message: '405 Method Not Allowed' });
      break;
    }
  }
};

export default withAuth(pollHandler);
