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

export default prisma;
