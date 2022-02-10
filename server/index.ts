import { createServer } from 'http';
import url from 'url';

import next from 'next';
import WebSocket from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) =>
    handler(req, res, url.parse(req.url!, true))
  );
  const wss = new WebSocket.Server({ noServer: true });

  const clientMap = new WeakMap<
    WebSocket,
    { pollId: string; sender: boolean }
  >();

  wss.on('connection', async (ws, req) => {
    const { query } = url.parse(req.url!, true);

    if (!query.pollId) {
      ws.close();
      return;
    }

    clientMap.set(ws, {
      pollId: query.pollId.toString(),
      sender: query.sender?.toString() === 'true',
    });

    ws.on('message', (data, binary) => {
      wss.clients.forEach((client) => {
        const clientData = clientMap.get(client);
        const wsData = clientMap.get(ws);

        if (
          client !== ws &&
          client.readyState === WebSocket.OPEN &&
          !clientData?.sender &&
          clientData?.pollId === wsData?.pollId
        ) {
          client.send(data, { binary });
        }
      });
    });
  });

  server.on('upgrade', (req, socket, head) => {
    const { pathname, query } = url.parse(req.url!, true);

    if (pathname === '/api/ws' && query.pollId) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    }
  });

  server.listen(port, (err?: any) => {
    if (err) {
      throw err;
    }

    // eslint-disable-next-line no-console
    console.log(`> Server ready to serve requests (:${port})`);
  });
});
