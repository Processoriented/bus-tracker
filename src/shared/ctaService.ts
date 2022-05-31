import { Prediction, Pattern, APIResponse, GTRoute } from '../models';


export type ServicePlucker<T = any> = ((obj: APIResponse<T>) => T[] | Partial<T>[] | PromiseLike<Partial<T>[]>);
export type ServiceFormatter<T = any> = ((plucked: T[] | Partial<T>[]) => T[] | PromiseLike<T[]>);
export type ServiceCatcher = ((reason: any) => void | PromiseLike<void>);

export interface APIParams {
  [k: string]: string|number;
}

export type ServiceOptions<T = any> = {
  service: 'api' | 'cta';
  resource: string;
  params?: APIParams;
  plucker?: ServicePlucker<T>;
  formatter?: ServiceFormatter<T>;
  catcher?: ServiceCatcher;
}

export const baseUrl: string = `${process.env.REACT_APP_API_BASE_URL}`;
export const defaultCatcher: ServiceCatcher = error => console.error({ error });

const respChecker = <T = any>(resp: APIResponse<T>): APIResponse<T> => {
  if (resp.error) throw new Error(JSON.stringify(resp.error));
  return resp;
};

export function getData<T = any>(options: ServiceOptions<T>) {
  const { service, resource, params, plucker, formatter } = options;
  const catcher = options?.catcher ?? defaultCatcher;
  const requestOptions = { method: 'GET' };
  const endpoint = new URL(`${baseUrl}${service}/${resource}`);
  Object.entries({ ...params }).forEach(([k, v]) => endpoint.searchParams.append(k, `${v}`));
  return fetch(endpoint.href, requestOptions)
    .then(response => response.json() as APIResponse)
    .then(respChecker)
    .then(plucker) //.then(plucked => { console.log({ plucked }); return plucked; })
    .then(formatter) //.then(fmtd => { console.log({ fmtd }); return fmtd; })
    .catch(catcher);
};

const makePlucker = <T>(): ServicePlucker<T> => {
  return (resp) => resp?.data ?? ([] as Partial<T>[]);
};

export const getPredictions = (options: Partial<ServiceOptions<Prediction>>) => {
  const resource = 'getpredictions';
  const params = { ...(options.params) } as APIParams;
  const plucker: ServicePlucker<Prediction> = makePlucker();
  const formatter: ServiceFormatter<Prediction> = (data) => ([...(data ?? [])]
    .map(prd => new Prediction(prd)));
  const opts: ServiceOptions<Prediction> = { ...options, service: 'cta', resource,
    params, plucker, formatter };
  return getData(opts) as Promise<Prediction[]>;
};

export const getPatterns = (options: Partial<ServiceOptions<Pattern>>) => {
  const resource = 'getpatterns';
  const params = { ...(options.params) } as APIParams;
  const plucker: ServicePlucker<Pattern> = makePlucker();
  const formatter: ServiceFormatter<Pattern> = (ptrs) => ([...(ptrs ?? [])]
    .map(ptr => new Pattern(ptr)));
  const opts: ServiceOptions<Pattern> = { ...options, service: 'cta', resource, params,
    plucker, formatter };
  return getData(opts) as Promise<Pattern[]>;
};

export const getGTRoutes = (options: Partial<ServiceOptions<GTRoute>>) => {
  const resource = 'routes';
  const params: APIParams = { ...(options?.params) };
  const plucker: ServicePlucker<GTRoute> = makePlucker();
  const formatter: ServiceFormatter<GTRoute> = (data) => ([...(data ?? [])].map(r => new GTRoute(r)));
  const opts: ServiceOptions<GTRoute> = { ...options, service: 'api', resource, params, plucker, formatter };
  return getData(opts) as Promise<GTRoute[]>;
};