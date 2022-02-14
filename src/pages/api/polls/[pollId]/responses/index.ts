import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

import prisma from '@/lib/prisma';
import { parsePollResponse } from '@/utils/types';

const pollResponsesHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const pollId = req.query.pollId?.toString();
  const poll = await prisma.poll.findFirst({
    select: { author: true, schema: true },
    where: { id: pollId },
  });

  if (!poll) {
    res.status(404).json({ message: '404 Not Found' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      let resps;

      if (session && poll.author.id === session.user.id) {
        resps = await prisma.pollResponse.findMany({
          select: {
            id: true,
            data: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          where: { pollId },
        });
      } else {
        resps = await prisma.pollResponse.findMany({
          select: {
            id: true,
            data: true,
            createdAt: true,
            updatedAt: true,
          },
          where: { pollId },
        });
      }

      res.status(200).json({
        responses: resps.map((resp) => parsePollResponse(resp)),
      });
      break;
    }

    case 'POST': {
      const data = JSON.stringify(req.body.response.data);
      if (!data) {
        res.status(422).json({ message: '422 Unprocessable Entity' });
        return;
      }

      const { authRequired } = JSON.parse(poll.schema);
      if (authRequired && !session) {
        res.status(401).json({ message: '401 Unauthorized' });
        return;
      }

      res.status(200).json({
        response: parsePollResponse(
          session
            ? await prisma.pollResponse.create({
                data: {
                  poll: { connect: { id: pollId } },
                  user: { connect: { id: session.user.id } },
                  data,
                },
              })
            : await prisma.pollResponse.create({
                data: {
                  poll: { connect: { id: pollId } },
                  data,
                },
              })
        ),
      });
      break;
    }

    default: {
      res.status(405).json({ message: '405 Method Not Allowed' });
      break;
    }
  }
};

export default pollResponsesHandler;
