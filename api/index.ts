import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from 'dotenv';
import cors from 'cors';


config();
const BASE_URL = process.env.CTA_API_URL;
const CTA_KEY = process.env.CTA_API_KEY;
const PORT = 8000;
const app = express();

app.use(cors());

const errHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
};

app.use(errHandler);

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello ${req?.query?.name ?? 'World'}.`);
});

const hpmOptions: Options = {
  target: `${BASE_URL}`,
  changeOrigin: true,
  pathRewrite: (path, req: Request) => {
    let newPath = path.replace(/^\/api/, '');
    const endpoint = newPath.split('?')[0];
    const query = Object.entries(req.query)
      .reduce((p, [k, v]) => ([...p, `${k}=${v}`]), [] as Array<string>);
    const qs = ['format=json', `key=${CTA_KEY}`, ...(query)].join('&');
    return [endpoint, qs].join('?');
  },
};

const hpm = createProxyMiddleware(hpmOptions);

app.get('/api/*', hpm);

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
