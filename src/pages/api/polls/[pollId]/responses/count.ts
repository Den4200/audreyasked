import { NextApiHandler } from 'next';

import prisma from '@/lib/prisma';

const pollResponseCountHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ message: '405 Method Not Allowed' });
    return;
  }

  const count = await prisma.pollResponse.count({
    where: {
      pollId: req.query.pollId!.toString(),
    },
  });

  res.status(200).json({ count });
};

export default pollResponseCountHandler;
