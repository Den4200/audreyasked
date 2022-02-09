import { createServer } from 'http';
import url from 'url';

import next from 'next';
import WebSocket from 'ws';

const pollResponsesRe = /\/polls\/([a-z0-9]+)\/responses\/?/;
const pollRe = /\/polls\/([a-z0-9]+)\/?/;

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
    const pollMatch = req.url!.match(pollRe);
    const respMatch = req.url!.match(pollResponsesRe);

    if (respMatch) {
      clientMap.set(ws, { pollId: respMatch[1]!, sender: false });
    } else if (pollMatch) {
      clientMap.set(ws, { pollId: pollMatch[1]!, sender: true });
    } else {
      ws.close();
    }

    ws.on('message', (data) => {
      wss.clients.forEach((client) => {
        const clientData = clientMap.get(client);
        const wsData = clientMap.get(ws);

        if (
          client !== ws &&
          client.readyState === WebSocket.OPEN &&
          !clientData?.sender &&
          clientData?.pollId === wsData?.pollId
        ) {
          client.send(data);
        }
      });
    });
  });

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = url.parse(req.url!, true);

    if (pathname?.match(pollRe) || pathname?.match(pollResponsesRe)) {
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
