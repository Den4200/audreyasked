import withAuth, { AuthApiHandler } from '@/lib/auth';
import prisma from '@/lib/prisma';

const parsePollResponse = (pollResponse: {
  id: string;
  data: string;
  userId: string | null;
}) => ({ ...pollResponse, data: JSON.parse(pollResponse.data) });

const pollResponseHandler: AuthApiHandler = async (req, res) => {
  const pollId = req.query.pollId!.toString();
  const responseId = req.query.responseId!.toString();

  const poll = await prisma.poll.findFirst({
    select: { author: true },
    where: { id: pollId },
  });
  if (!poll) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  const response = await prisma.pollResponse.findFirst({
    select: { id: true, data: true, userId: true },
    where: { id: responseId, pollId },
  });
  if (!response) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      const resp =
        poll.author.email === req.session.user?.email
          ? { response: parsePollResponse(response) }
          : { response: { id: response.id, data: JSON.parse(response.data) } };

      res.status(200).json(resp);
      break;
    }

    case 'PUT': {
      const pollResponse = await prisma.pollResponse.findFirst({
        select: { user: true },
        where: { id: responseId, pollId },
      });

      if (pollResponse!.user?.email !== req.session.user?.email) {
        res.status(401).json({ message: '401 Forbidden' });
        break;
      }

      const data = JSON.stringify(req.body.response.data);
      if (!data) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        break;
      }

      const { count } = await prisma.pollResponse.updateMany({
        data: { data },
        where: { id: responseId, pollId },
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

export default withAuth(pollResponseHandler);
