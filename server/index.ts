import { createServer } from 'http';
import url from 'url';

import next from 'next';
import WebSocket from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const wss = new WebSocket.Server({ noServer: true });
  const server = createServer((req, res) =>
    handler(req, res, url.parse(req.url!, true))
  );

  wss.on('connection', async (ws) => {
    console.log('incoming connection');

    // eslint-disable-next-line no-param-reassign
    ws.onclose = () => {
      console.log('connection closed');
    };
  });

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = url.parse(req.url!, true);

    if (!dev || pathname !== '/_next/webpack-hmr') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    }
  });

  server.listen(port, (err?: any) => {
    if (err) {
      throw err;
    }

    console.log('server started');
  });
});
