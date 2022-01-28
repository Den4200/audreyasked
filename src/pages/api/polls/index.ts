import withAuth, { AuthApiHandler } from '@/lib/auth';
import prisma from '@/lib/prisma';

const parsePoll = (poll: { id: string; schema: string }) => ({
  ...poll,
  schema: JSON.parse(poll.schema),
});

const pollsHandler: AuthApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const polls = await prisma.poll.findMany({
        select: { id: true, schema: true },
        where: { author: { email: { equals: req.session.user?.email } } },
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
        select: { id: true, schema: true },
        data: {
          author: { connect: { email: req.session.user?.email! } },
          schema: pollSchema,
        },
      });

      res.status(200).json({ poll: parsePoll(poll) });
      break;
    }

    case 'PUT': {
      const pollSchema = JSON.stringify(req.body.poll.schema);
      if (!pollSchema) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        break;
      }

      const { count } = await prisma.poll.updateMany({
        data: { schema: pollSchema },
        where: {
          id: req.body.poll.id,
        },
      });

      res.status(200).json({ updated: count });
      break;
    }

    case 'DELETE': {
      const { count } = await prisma.poll.deleteMany({
        where: {
          id: req.body.poll.id,
          author: { email: { equals: req.session.user?.email } },
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

export default withAuth(pollsHandler);
