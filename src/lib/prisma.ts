import { PrismaClient } from '@prisma/client';
import { WebSocket } from 'ws';

import { parsePollResponse } from '@/utils/types';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);

  if (params.action === 'create' && params.model === 'PollResponse') {
    const ws = new WebSocket(
      `ws://127.0.0.1:${process.env.PORT || 3000}/api/ws?pollId=${
        result.pollId
      }&sender=true`
    );

    ws.on('open', () => {
      ws.send(JSON.stringify({ pollResponse: parsePollResponse(result) }));
      ws.close();
    });
  }

  return result;
});

prisma.$use(async (params, next) => {
  if (
    params.action === 'create' &&
    params.model === 'User' &&
    !params.args.data.name
  ) {
    const { email } = params.args.data;

    // eslint-disable-next-line no-param-reassign
    params.args.data.name = email.substring(0, email.lastIndexOf('@'));
  }

  return next(params);
});

export default prisma;
