import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

import { withAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parsePollResponse } from '@/utils/types';

const pollResponseHandler: NextApiHandler = async (req, res) => {
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
    select: {
      id: true,
      data: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
    where: { id: responseId, pollId },
  });
  if (!response) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { userId, ...responseWithoutUser } = response;

      const session = await getSession({ req });
      const resp =
        session && poll.author.email === session.user?.email
          ? { response: parsePollResponse(response) }
          : { response: parsePollResponse(responseWithoutUser) };

      res.status(200).json(resp);
      break;
    }

    case 'PUT': {
      const pollResponsePutHandler = withAuth(async (aReq, aRes) => {
        const pollResponse = await prisma.pollResponse.findFirst({
          select: { user: true },
          where: { id: responseId, pollId },
        });

        if (pollResponse!.user?.email !== aReq.session.user?.email) {
          aRes.status(403).json({ message: '403 Forbidden' });
          return;
        }

        const data = JSON.stringify(aReq.body.response.data);
        if (!data) {
          aRes.status(422).json({ message: '422 Unprocessable Entity' });
          return;
        }

        const { count } = await prisma.pollResponse.updateMany({
          data: { data },
          where: { id: responseId, pollId },
        });

        aRes.status(200).json({ updated: count });
      });
      pollResponsePutHandler(req, res);
      break;
    }

    default: {
      res.status(405).json({ message: '405 Method Not Allowed' });
      break;
    }
  }
};

export default pollResponseHandler;
