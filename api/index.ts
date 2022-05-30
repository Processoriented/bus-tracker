import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import { unzip } from './src/util';
import { getGTData } from './src/gtData';
import { getProxyMiddleware } from './src/proxyMiddleware';


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

const hpm = getProxyMiddleware(BASE_URL, CTA_KEY);

app.get('/cta/*', hpm);

app.get('/static/:file', (req, res, next) => {
  unzip(`${req.params.file}.txt`)
    .then(JSON.stringify)
    .then(d => res.status(200).send(d))
    .catch(next);
});

app.get('/api/:resource', getGTData);

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
