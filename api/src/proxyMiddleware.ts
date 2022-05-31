import { Request } from 'express';
import { createProxyMiddleware, Options, responseInterceptor } from 'http-proxy-middleware';
import { Pattern, Prediction } from './models';


const makePathRewrite = (ctaKey: string | undefined) => {
  return (path: string, req: Request) => {
    let newPath = path.replace(/^\/cta/, '');
    const endpoint = newPath.split('?')[0];
    const query = Object.entries(req.query)
      .reduce((p, [k, v]) => ([...p, `${k}=${v}`]), [] as Array<string>);
    const qs = ['format=json', `key=${ctaKey}`, ...(query)].join('&');
    return [endpoint, qs].join('?');
  };
};

type ResourceFnReturn<T = any> = { data: T[], errata: any };
type ResourceFnInput<T = any> = { [key: string]: Partial<T>[] | T[] };
type ResourceFn<T = any> = (obj: ResourceFnInput<T>) => ResourceFnReturn<T>;

const mtRtn: ResourceFnReturn = { data: [], errata: {} };

const fallback: ResourceFn = (obj) => {
  return Object.entries(obj).reduce((p, [k, v], idx) => {
    const { data, errata } = p;
    if (idx === 0) return ({ data: v, errata });
    return { data, errata: { ...errata, [k]: v } };
  }, mtRtn);
};

const getpatterns: ResourceFn<Pattern> = (obj) => {
  const rtn = fallback(obj);
  const data = [...(rtn?.data ?? [])].map(p => new Pattern(p));
  return { ...rtn, data };
};

const getpredictions: ResourceFn<Prediction> = (obj) => {
  const rtn = fallback(obj);
  const data = [...(rtn?.data ?? [])].map(p => new Prediction(p));
  return { ...rtn, data };
};

const resourceFns: { [resourceName: string]: ResourceFn } = {
  fallback,
  getpatterns,
  getpredictions,
};

const formatResponse = (resource: string, obj: any) => {
  const fn = resourceFns[resource] ?? fallback;
  return fn(obj);
};

const resourceFromUrl = (url: string) => {
  const noQuery = `${[...(`${url}`.split('?')), ''].shift()}`;
  const lastPart = `${['', ...(`${noQuery}`.split('/'))].pop()}`;
  return Object.keys(resourceFns).includes(lastPart) ? lastPart : 'fallback';
};

const makeRespHanlder = () => {
  return responseInterceptor(async (responseBuffer, proxyRes, req, _res) => {
    if (proxyRes.headers['content-type'] !== 'application/json;charset=utf-8') return responseBuffer;
    const wrapped = JSON.parse(responseBuffer.toString('utf8'));
    const bustimeResp = wrapped['bustime-response'];
    if (!bustimeResp) return responseBuffer;
    const rtn = formatResponse(resourceFromUrl(req?.url ?? ''), bustimeResp);
    return JSON.stringify(rtn);
  });
};

export function getProxyMiddleware(baseUrl: string | undefined, ctaKey: string | undefined) {
  const target = `${baseUrl}`;
  const [changeOrigin, selfHandleResponse] = [true, true];
  const pathRewrite = makePathRewrite(ctaKey);
  const onProxyRes = makeRespHanlder();
  const hpmOptions: Options = { target, changeOrigin, pathRewrite, selfHandleResponse, onProxyRes };
  return createProxyMiddleware(hpmOptions);
}
