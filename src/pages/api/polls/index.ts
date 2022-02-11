import { AuthApiHandler, withAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parsePoll } from '@/utils/types';

const pollsHandler: AuthApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const polls = await prisma.poll.findMany({
        select: { id: true, schema: true, createdAt: true, updatedAt: true },
        where: { author: { id: req.session.user.id } },
      });
      res.status(200).json({ polls: polls.map(parsePoll) });
      break;
    }

    case 'POST': {
      const pollSchema = JSON.stringify(req.body.poll.schema);
      if (!pollSchema) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        break;
      }

      const poll = await prisma.poll.create({
        select: { id: true, schema: true, createdAt: true, updatedAt: true },
        data: {
          author: { connect: { id: req.session.user.id } },
          schema: pollSchema,
        },
      });

      res.status(200).json({ poll: parsePoll(poll) });
      break;
    }

    default: {
      res.status(405).json({ message: '405 Method Not Allowed' });
      break;
    }
  }
};

export default withAuth(pollsHandler);
