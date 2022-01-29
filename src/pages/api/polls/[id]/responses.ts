import withAuth, { AuthApiHandler } from '@/lib/auth';
import prisma from '@/lib/prisma';

const parsePollResponse = (pollResponse: {
  id: string;
  data: string;
  userId: string | null;
}) => ({ ...pollResponse, data: JSON.parse(pollResponse.data) });

const pollResponsesHandler: AuthApiHandler = async (req, res) => {
  const pollId = req.query.id?.toString();
  const poll = await prisma.poll.findFirst({
    select: { author: true },
    where: { id: { equals: pollId } },
  });

  if (!poll) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      const query = {
        select: { id: true, data: true, userId: false },
        where: { pollId },
      };

      if (poll.author.email === req.session.user?.email) {
        query.select.userId = true;
      }

      const resps = await prisma.pollResponse.findMany(query);
      res
        .status(200)
        .json({ responses: resps.map((resp) => parsePollResponse(resp)) });
      break;
    }

    case 'POST': {
      const data = JSON.stringify(req.body.response.data);
      if (!data) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        break;
      }

      const resp = await prisma.pollResponse.create({
        data: {
          poll: { connect: { id: pollId } },
          user: { connect: { email: req.session.user?.email! } },
          data,
        },
      });

      res.status(200).json({ response: parsePollResponse(resp) });
      break;
    }

    case 'PUT': {
      const data = JSON.stringify(req.body.response.data);
      if (!data) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        break;
      }

      const { count } = await prisma.pollResponse.updateMany({
        data: { data },
        where: { id: req.body.response.id },
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

export default withAuth(pollResponsesHandler);