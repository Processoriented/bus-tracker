import express, { Request, Response } from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import { config } from 'dotenv';



config();
const BASE_URL = process.env.CTA_API_URL;
const CTA_KEY = process.env.CTA_API_KEY;
const PORT = 8000;
const app = express();

const ctaUrl = (endpoint = '') => {
  const rtn = new URL(`${BASE_URL}${endpoint}`);
  rtn.searchParams.append('format', 'json');
  rtn.searchParams.append('key', `${CTA_KEY}`);
  return rtn;
};

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello ${req?.query?.name ?? 'World'}.`);
});

app.get('/api/*', createProxyMiddleware({
  target: `${BASE_URL}`,
  changeOrigin: true,
  pathRewrite: (path, req: Request) => {
    let newPath = path.replace(/^\/api/, '');
    const endpoint = newPath.split('?')[0];
    const { query } = req;
    // 'format=json', 
    const qs = [`key=${CTA_KEY}`, ...(`${query ?? ''}`).split('&')].join('&');
    return [endpoint, qs].join('?');
  },
}));

app.listen(PORT, () => console.log(`API is listening on port ${PORT}`));
